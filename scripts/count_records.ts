import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const counts = {
    users: await prisma.user.count(),
    products: await prisma.product.count(),
    orders: await prisma.order.count(),
    activity: await prisma.activity.count(),
    categories: await prisma.category.count(),
    subCategories: await prisma.subCategory.count(),
    units: await prisma.unit.count(),
    grades: await prisma.grade.count(),
    auctions: await prisma.auction.count(),
    bids: await prisma.bid.count(),
    cart: await prisma.cart.count(),
    cartItems: await prisma.cartItem.count(),
    payments: await prisma.payment.count(),
    deliveryAssignments: await prisma.deliveryAssignment.count(),
    chatMessages: await prisma.chatMessage.count(),
    notifications: await prisma.notification.count(),
    wishlists: await prisma.wishlist.count(),
    searchHistories: await prisma.searchHistory.count(),
    reviews: await prisma.review.count(),
    farmerVerifications: await prisma.farmerVerification.count(),
    coupons: await prisma.coupon.count(),
    auditLogs: await prisma.auditLog.count(),
  };
  console.log('---COUNT_RESULTS---');
  console.dir(counts, { depth: null });

  // Sample records
  const samples = {
    user: await prisma.user.findFirst(),
    product: await prisma.product.findFirst(),
    order: await prisma.order.findFirst(),
    activity: await prisma.activity.findFirst(),
    category: await prisma.category.findFirst(),
  };
  console.log('---SAMPLE_RECORDS---');
  console.dir(samples, { depth: null });
}

main()
  .catch((e) => {
    console.error('Error executing count script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
