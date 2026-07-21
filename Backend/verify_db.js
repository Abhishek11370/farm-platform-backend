const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const users = await prisma.user.count();
  const farmers = await prisma.user.count({ where: { role: 'FARMER' }});
  const buyers = await prisma.user.count({ where: { role: 'BUYER' }});
  const admins = await prisma.user.count({ where: { role: 'ADMIN' }});
  const categories = await prisma.category.count();
  const subCategories = await prisma.subCategory.count();
  const products = await prisma.product.count();
  const orders = await prisma.order.count();
  const auctions = await prisma.auction.count();

  console.log(`Users: ${users} (Admins: ${admins}, Buyers: ${buyers}, Farmers: ${farmers})`);
  console.log(`Categories: ${categories}, SubCategories: ${subCategories}`);
  console.log(`Products: ${products}, Orders: ${orders}, Auctions: ${auctions}`);
  process.exit(0);
}

verify().catch(console.error);
