import { PrismaClient } from "@prisma/client";
import { generateUsers } from "./seed/generators/userGenerator";
import { generateFarmers } from "./seed/generators/farmerGenerator";
import { generateBuyers } from "./seed/generators/buyerGenerator";
import { generateAddresses } from "./seed/generators/addressGenerator";
import { generateCategories } from "./seed/generators/categoryGenerator";
import { generateProducts } from "./seed/generators/productGenerator";
import { generateOrders } from "./seed/generators/orderGenerator";
import { generateOrderItems } from "./seed/generators/orderItemGenerator";
import { generatePayments } from "./seed/generators/paymentGenerator";
import { generateReviews } from "./seed/generators/reviewGenerator";
import { generateNotifications } from "./seed/generators/notificationGenerator";
import { generateAuctions } from "./seed/generators/auctionGenerator";
import { generateAuctionBids } from "./seed/generators/auctionBidGenerator";
import { generateChatMessages } from "./seed/generators/chatMessageGenerator";
import { generateWishlistItems } from "./seed/generators/wishlistItemGenerator";
import { generateCartItems } from "./seed/generators/cartItemGenerator";

const main = async () => {
  const prisma = new PrismaClient();
  try {
    console.log("🌱 Starting seed process...");
    
    // Core entities
    await generateUsers(prisma, 40);
    await generateFarmers(prisma, 20);
    await generateBuyers(prisma, 20);
    await generateAddresses(prisma, 40);

    // Catalog
    await generateCategories(prisma);
    await generateProducts(prisma, 100);

    // Transactions
    await generateOrders(prisma, 200);
    await generateOrderItems(prisma, 250);
    await generatePayments(prisma);
    await generateReviews(prisma, 100);

    // Notifications & communications
    await generateNotifications(prisma, 100);
    await generateChatMessages(prisma, 300);

    // Auctions
    await generateAuctions(prisma, 50);
    await generateAuctionBids(prisma, 250);

    // User conveniences
    await generateWishlistItems(prisma, 100);
    await generateCartItems(prisma, 100);

    console.log("✅ Seed process completed successfully!");
  } catch (error) {
    console.error("❌ Seed process failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
