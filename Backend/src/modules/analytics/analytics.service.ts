import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Admin dashboard: high-level KPI summary */
  async getDashboard() {
    const [
      totalUsers,
      totalFarmers,
      totalBuyers,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalAuctions,
      totalReviews,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'FARMER' } }),
      this.prisma.user.count({ where: { role: 'BUYER' } }),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({ where: { status: 'PAID' }, _sum: { amount: true } }),
      this.prisma.auction.count(),
      this.prisma.review.count(),
    ]);

    return {
      users: { total: totalUsers, farmers: totalFarmers, buyers: totalBuyers },
      products: totalProducts,
      orders: totalOrders,
      revenue: totalRevenue._sum.amount ?? 0,
      auctions: totalAuctions,
      reviews: totalReviews,
    };
  }

  /** Revenue by day for the past N days */
  async getRevenueTimeline(days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const payments = await this.prisma.payment.findMany({
      where: { status: 'PAID', createdAt: { gte: since } },
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
}
