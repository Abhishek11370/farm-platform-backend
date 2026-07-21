const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = [
    'User',
    'Category',
    'SubCategory',
    'Product',
    'ProductImage',
    'Unit',
    'InventoryLog',
    'Order',
    'OrderItem',
    'Auction',
    'Bid',
    'Payment',
    'Review',
    'Notification',
    'Cart',
    'CartItem',
    'Coupon',
    'Wishlist',
    'FarmerProfile',
    'ActivityLog',
    'Blog',
    'Banner',
    'FAQ',
    'SupportTicket',
    'Setting',
  ];

  const results = {};
  for (const model of models) {
    if (prisma[model.charAt(0).toLowerCase() + model.slice(1)]) {
      const count = await prisma[model.charAt(0).toLowerCase() + model.slice(1)].count();
      results[model] = count;
    } else {
      results[model] = 'Model not found on Prisma Client';
    }
  }

  // Also specific counts
  const admins = await prisma.user.count({ where: { role: 'ADMIN' } });
  const buyers = await prisma.user.count({ where: { role: 'BUYER' } });
  const farmers = await prisma.user.count({ where: { role: 'FARMER' } });
  const liveAuctions = await prisma.auction.count({ where: { status: 'LIVE' } });
  const closedAuctions = await prisma.auction.count({ where: { status: 'CLOSED' } });

  results['Users: ADMIN'] = admins;
  results['Users: BUYER'] = buyers;
  results['Users: FARMER'] = farmers;
  results['Auctions: LIVE'] = liveAuctions;
  results['Auctions: CLOSED'] = closedAuctions;

  console.log(JSON.stringify(results, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
