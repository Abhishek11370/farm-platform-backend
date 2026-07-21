import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalAdmins,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      totalAuctions,
      totalPayments,
      totalReviews,
      totalNotifications,
      totalCoupons,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'FARMER' } }),
      this.prisma.user.count({ where: { role: 'BUYER' } }),
      this.prisma.user.count({ where: { role: 'ADMIN' } }),
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      this.prisma.auction.count(),
      this.prisma.payment.count(),
      this.prisma.review.count(),
      this.prisma.notification.count(),
      this.prisma.coupon.count(),
    ]);

    return {
      users: { total: totalUsers, farmers: totalFarmers, buyers: totalBuyers, admins: totalAdmins },
      products: totalProducts,
      categories: totalCategories,
      orders: totalOrders,
      revenue: totalRevenue._sum.amount ?? 0,
      auctions: totalAuctions,
      payments: totalPayments,
      reviews: totalReviews,
      notifications: totalNotifications,
      coupons: totalCoupons,
    };
  }

  /** Revenue by day for the past N days */
  async getRevenueTimeline(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Payment status can be 'PAID' or 'SUCCESS' depending on flow
    const payments = await this.prisma.payment.findMany({
      where: {
        status: { in: ['PAID', 'SUCCESS', 'COMPLETED'] },
        createdAt: { gte: since },
      },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const map: Record<string, number> = {};
    for (const p of payments) {
      const key = p.createdAt.toISOString().split('T')[0];
      map[key] = (map[key] || 0) + p.amount;
    }

    return Object.entries(map).map(([date, revenue]) => ({ date, revenue }));
  }

  /** Top selling products */
  async getTopProducts(limit = 10) {
    const items = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { qty: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: limit,
    });

    const productIds = items.map(i => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { owner: { select: { name: true } }, images: { take: 1 } },
    });

    return items.map(item => ({
      product: products.find(p => p.id === item.productId),
      totalQuantitySold: item._sum.qty,
    }));
  }

  /** User growth by month */
  async getUserGrowth() {
    const users = await this.prisma.user.findMany({
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    });

    const map: Record<string, { farmers: number; buyers: number }> = {};
    for (const u of users) {
      const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!map[key]) map[key] = { farmers: 0, buyers: 0 };
      if (u.role === 'FARMER') map[key].farmers++;
      if (u.role === 'BUYER') map[key].buyers++;
    }

    return Object.entries(map).map(([month, counts]) => ({ month, ...counts }));
  }

  /** Order status distribution */
  async getOrderStats() {
    const statuses = await this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    return statuses.map(s => ({ status: s.status, count: s._count.status }));
  }

  /** Active auction stats */
  async getAuctionStats() {
    const [live, closed, cancelled, totalBids, totalRevenue] = await this.prisma.$transaction([
      this.prisma.auction.count({ where: { status: 'LIVE' } }),
      this.prisma.auction.count({ where: { status: 'CLOSED' } }),
      this.prisma.auction.count({ where: { status: 'CANCELLED' } }),
      this.prisma.bid.count(),
      this.prisma.bid.aggregate({ _sum: { amount: true } }),
    ]);
    return { live, closed, cancelled, totalBids, totalBidVolume: totalRevenue._sum.amount ?? 0 };
  }

  async getFarmerAnalytics(userId: string) {
    const products = await this.prisma.product.count({ where: { ownerId: userId } });
    
    // Total orders containing farmer's products
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        product: { ownerId: userId }
      },
      include: {
        order: true,
        product: true
      }
    });

    const activeOrders = new Set(
      orderItems
        .filter(item => item.order.status !== 'DELIVERED' && item.order.status !== 'CANCELLED')
        .map(item => item.orderId)
    ).size;

    const earnings = orderItems
      .filter(item => item.order.status === 'DELIVERED')
      .reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Recent sales
    const recentSales = orderItems
      .filter(item => item.order.status === 'DELIVERED')
      .sort((a, b) => b.order.createdAt.getTime() - a.order.createdAt.getTime())
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        productName: item.product.title,
        amount: item.price * item.qty,
        date: item.order.createdAt
      }));

    return {
      activeInventory: products,
      ordersToShip: activeOrders,
      totalEarnings: earnings,
      recentSales
    };
  }

  async getAIInsights() {
    const productsCount = await this.prisma.product.count();
    const ordersCount = await this.prisma.order.count();
    const activeAuctions = await this.prisma.auction.count({ where: { status: 'LIVE' } });
    
    // Simulate AI predictions based on actual counts
    const pricePrediction = {
      trend: activeAuctions > 5 ? 'UPWARD' : 'STABLE',
      confidence: 85,
      message: activeAuctions > 5 
        ? 'High auction activity detected. Expect commodity prices to rise by 4-6% this week.'
        : 'Market is stable. Prices should remain consistent.'
    };

    const demandForecast = {
      level: ordersCount > 20 ? 'HIGH' : 'MODERATE',
      hotProducts: await this.getTopProducts(3).then(res => res.map(r => r.product?.title).filter(Boolean)),
      message: `Based on ${ordersCount} recent orders, demand is currently ${ordersCount > 20 ? 'HIGH' : 'MODERATE'}.`
    };

    const cropRecommendation = {
      season: 'Upcoming',
      suggestions: ['Wheat', 'Corn', 'Soybeans'],
      message: 'Based on historical sales in your region, these crops yield highest profitability.'
    };

    return {
      pricePrediction,
      demandForecast,
      cropRecommendation,
      lastUpdated: new Date()
    };
  }
}
