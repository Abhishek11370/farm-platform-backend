const { PrismaClient } = require('@prisma/client');

async function validate() {
  const prisma = new PrismaClient();
  try {
    const counts = {
      User: await prisma.user.count(),
      Farmer: await prisma.user.count({ where: { role: 'FARMER' } }),
      Buyer: await prisma.user.count({ where: { role: 'BUYER' } }),
      Address: await prisma.address.count(),
      Category: await prisma.category.count(),
      Product: await prisma.product.count(),
      Order: await prisma.order.count(),
      OrderItem: await prisma.orderItem.count(),
      Payment: await prisma.payment.count(),
      Review: await prisma.review.count(),
      Notification: await prisma.notification.count(),
      Auction: await prisma.auction.count(),
      AuctionBid: await prisma.bid.count(),
      ChatMessage: await prisma.chatMessage.count(),
      Wishlist: await prisma.wishlist.count(),
      Cart: await prisma.cart.count(),
      CartItem: await prisma.cartItem.count(),
    };
    console.log(JSON.stringify(counts, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

validate();
