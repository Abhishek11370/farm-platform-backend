import { PrismaClient, NotificationType, CouponDiscountType, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding missing models...');

  const users = await prisma.user.findMany({ take: 10 });
  const products = await prisma.product.findMany({ take: 10 });
  const farmers = await prisma.user.findMany({ where: { role: 'FARMER' }, take: 10 });
  const orders = await prisma.order.findMany({ take: 10 });

  if (users.length === 0 || products.length === 0) {
    console.log('Not enough base data to seed relations.');
    return;
  }

  // Seed Notifications
  const notifCount = await prisma.notification.count();
  if (notifCount === 0) {
    for (const u of users) {
      await prisma.notification.create({
        data: {
          userId: u.id,
          title: 'Welcome to Farm Platform',
          message: 'Explore fresh organic produce today.',
          type: NotificationType.ADMIN,
        }
      });
    }
    console.log('Seeded Notifications');
  }

  // Seed Wishlists
  const wishCount = await prisma.wishlist.count();
  if (wishCount === 0) {
    for (const u of users) {
      await prisma.wishlist.create({
        data: {
          userId: u.id,
          productId: products[Math.floor(Math.random() * products.length)].id
        }
      });
    }
    console.log('Seeded Wishlists');
  }

  // Seed Reviews
  const reviewCount = await prisma.review.count();
  if (reviewCount === 0) {
    for (const p of products) {
      await prisma.review.create({
        data: {
          productId: p.id,
          buyerId: users[Math.floor(Math.random() * users.length)].id,
          rating: 5,
          comment: 'Excellent quality produce!'
        }
      });
    }
    console.log('Seeded Reviews');
  }

  // Seed Coupons
  const couponCount = await prisma.coupon.count();
  if (couponCount === 0) {
    await prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        discountType: CouponDiscountType.PERCENTAGE,
        discountValue: 10,
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      }
    });
    console.log('Seeded Coupons');
  }

  // Seed FarmerVerifications
  const fvCount = await prisma.farmerVerification.count();
  if (fvCount === 0 && farmers.length > 0) {
    for (const f of farmers) {
      await prisma.farmerVerification.create({
        data: {
          farmerId: f.id,
          documentUrl: 'https://placeholder.com/doc.pdf',
          documentType: 'ID_CARD',
          status: VerificationStatus.PENDING
        }
      });
    }
    console.log('Seeded FarmerVerifications');
  }

  // Seed Payments
  const paymentCount = await prisma.payment.count();
  if (paymentCount === 0 && orders.length > 0) {
    for (const o of orders) {
      // Create payment only if not exists
      const existing = await prisma.payment.findUnique({ where: { orderId: o.id } });
      if (!existing) {
        await prisma.payment.create({
          data: {
            orderId: o.id,
            razorpayOrderId: `order_${Math.random().toString(36).substring(7)}`,
            status: 'PAID',
            amount: o.totalAmount > 0 ? o.totalAmount : 100,
          }
        });
      }
    }
    console.log('Seeded Payments');
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
