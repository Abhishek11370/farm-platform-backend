import os

generators_dir = r"C:\dev\farm-platform\prisma\seed\generators"

def write_file(filename, content):
    with open(os.path.join(generators_dir, filename), "w", encoding="utf-8") as f:
        f.write(content)

write_file("buyerGenerator.ts", """import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomPhone, randomEmail } from "../utils/generator";

export const generateBuyers = async (prisma: PrismaClient, count: number = 20) => {
  const buyers = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    buyers.push({
      id: uuidv4(),
      name,
      email: randomEmail(name),
      phone: randomPhone(),
      password: faker.internet.password({ length: 12 }),
      role: Role.BUYER,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await prisma.user.createMany({ data: buyers, skipDuplicates: true });
  return await prisma.user.findMany({ where: { role: Role.BUYER } });
};
""")

write_file("addressGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { CITIES } from "../constants/cities";
import { randomFromArray } from "../utils/generator";

export const generateAddresses = async (prisma: PrismaClient, count: number = 40) => {
  const users = await prisma.user.findMany();
  if (users.length === 0) return [];

  const addresses = [];
  for (let i = 0; i < count; i++) {
    const user = randomFromArray(users);
    addresses.push({
      id: uuidv4(),
      userId: user.id,
      fullName: user.name,
      phone: user.phone || faker.phone.number(),
      addressLine1: faker.location.streetAddress(),
      addressLine2: faker.helpers.maybe(() => faker.location.secondaryAddress()),
      city: randomFromArray(CITIES),
      state: "Gujarat",
      pincode: faker.location.zipCode("######"),
      isDefault: i % 2 === 0,
      createdAt: new Date(),
    });
  }
  await prisma.address.createMany({ data: addresses, skipDuplicates: true });
  return await prisma.address.findMany();
};
""")

write_file("categoryGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const generateCategories = async (prisma: PrismaClient) => {
  const categoriesData = [
    { name: "Vegetables", subCategories: ["Leafy", "Root", "Cruciferous"] },
    { name: "Fruits", subCategories: ["Citrus", "Tropical", "Berries"] },
    { name: "Grains", subCategories: ["Wheat", "Rice", "Millet"] },
  ];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { id: uuidv4(), name: cat.name },
    });
    
    const subcats = cat.subCategories.map((subName) => ({
      id: uuidv4(),
      name: subName,
      categoryId: category.id,
    }));
    await prisma.subCategory.createMany({ data: subcats, skipDuplicates: true });
  }
};
""")

write_file("productGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { allProducts } from "../constants/productData";
import { randomFromArray, randomImageUrl } from "../utils/generator";

export const generateProducts = async (prisma: PrismaClient, count: number = 100) => {
  const farmers = await prisma.user.findMany({ where: { role: "FARMER" } });
  const subCategories = await prisma.subCategory.findMany();
  
  if (farmers.length === 0 || subCategories.length === 0) return [];

  const products = [];
  for (let i = 0; i < count; i++) {
    products.push({
      id: uuidv4(),
      title: randomFromArray(allProducts) + " " + faker.commerce.productAdjective(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      quantity: faker.number.float({ min: 10, max: 1000 }),
      latitude: faker.location.latitude({ min: 20, max: 24 }), // Gujarat bounds approx
      longitude: faker.location.longitude({ min: 68, max: 74 }),
      ownerId: randomFromArray(farmers).id,
      subCategoryId: randomFromArray(subCategories).id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await prisma.product.createMany({ data: products, skipDuplicates: true });
  
  // Create product images
  const createdProducts = await prisma.product.findMany();
  const images = [];
  for (const product of createdProducts) {
    images.push({
      id: uuidv4(),
      productId: product.id,
      imageUrl: randomImageUrl(),
      isPrimary: true,
      createdAt: new Date(),
    });
  }
  await prisma.productImage.createMany({ data: images, skipDuplicates: true });
};
""")

write_file("orderGenerator.ts", """import { PrismaClient, OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateOrders = async (prisma: PrismaClient, count: number = 200) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  if (buyers.length === 0) return [];

  const orders = [];
  for (let i = 0; i < count; i++) {
    orders.push({
      id: uuidv4(),
      buyerId: randomFromArray(buyers).id,
      status: randomFromArray(Object.values(OrderStatus)),
      totalAmount: 0, // will be updated later
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });
  }
  await prisma.order.createMany({ data: orders, skipDuplicates: true });
};
""")

write_file("orderItemGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateOrderItems = async (prisma: PrismaClient, count: number = 250) => {
  const orders = await prisma.order.findMany();
  const products = await prisma.product.findMany();
  
  if (orders.length === 0 || products.length === 0) return [];

  const orderItems = [];
  for (let i = 0; i < count; i++) {
    const product = randomFromArray(products);
    orderItems.push({
      id: uuidv4(),
      orderId: randomFromArray(orders).id,
      productId: product.id,
      qty: faker.number.float({ min: 1, max: 20 }),
      price: product.price,
    });
  }
  await prisma.orderItem.createMany({ data: orderItems, skipDuplicates: true });

  // Update order totals
  for (const order of orders) {
    const items = await prisma.orderItem.findMany({ where: { orderId: order.id } });
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    if (total > 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: { totalAmount: total },
      });
    }
  }
};
""")

write_file("paymentGenerator.ts", """import { PrismaClient, OrderStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const generatePayments = async (prisma: PrismaClient) => {
  const orders = await prisma.order.findMany({ where: { totalAmount: { gt: 0 } } });
  if (orders.length === 0) return;

  const payments = [];
  for (const order of orders) {
    // only PAID, CONFIRMED, SHIPPED, DELIVERED have payments mostly
    if ([OrderStatus.PLACED, OrderStatus.CANCELLED].includes(order.status as OrderStatus)) {
      if (Math.random() > 0.3) continue; // some cancelled orders might have failed payments
    }
    
    payments.push({
      id: uuidv4(),
      orderId: order.id,
      razorpayOrderId: "order_" + faker.string.alphanumeric(14),
      razorpayPaymentId: "pay_" + faker.string.alphanumeric(14),
      status: "CAPTURED",
      amount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: new Date(),
    });
  }
  await prisma.payment.createMany({ data: payments, skipDuplicates: true });
};
""")

write_file("reviewGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateReviews = async (prisma: PrismaClient, count: number = 100) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const products = await prisma.product.findMany();
  
  if (buyers.length === 0 || products.length === 0) return [];

  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: uuidv4(),
      productId: randomFromArray(products).id,
      buyerId: randomFromArray(buyers).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.sentence(),
      createdAt: new Date(),
    });
  }
  await prisma.review.createMany({ data: reviews, skipDuplicates: true });
};
""")

write_file("notificationGenerator.ts", """import { PrismaClient, NotificationType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateNotifications = async (prisma: PrismaClient, count: number = 100) => {
  const users = await prisma.user.findMany();
  if (users.length === 0) return [];

  const notifications = [];
  for (let i = 0; i < count; i++) {
    notifications.push({
      id: uuidv4(),
      userId: randomFromArray(users).id,
      title: faker.lorem.words(3),
      message: faker.lorem.sentence(),
      type: randomFromArray(Object.values(NotificationType)),
      isRead: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
    });
  }
  await prisma.notification.createMany({ data: notifications, skipDuplicates: true });
};
""")

write_file("auctionGenerator.ts", """import { PrismaClient, AuctionStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateAuctions = async (prisma: PrismaClient, count: number = 50) => {
  const products = await prisma.product.findMany();
  if (products.length === 0) return [];

  const auctions = [];
  for (let i = 0; i < count; i++) {
    const product = randomFromArray(products);
    const startTime = faker.date.recent();
    const endTime = new Date(startTime);
    endTime.setDate(endTime.getDate() + faker.number.int({ min: 1, max: 7 }));

    auctions.push({
      id: uuidv4(),
      productId: product.id,
      startTime,
      endTime,
      basePrice: product.price,
      status: randomFromArray(Object.values(AuctionStatus)),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await prisma.auction.createMany({ data: auctions, skipDuplicates: true });
};
""")

write_file("auctionBidGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateAuctionBids = async (prisma: PrismaClient, count: number = 250) => {
  const auctions = await prisma.auction.findMany();
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  
  if (auctions.length === 0 || buyers.length === 0) return [];

  const bids = [];
  for (let i = 0; i < count; i++) {
    const auction = randomFromArray(auctions);
    bids.push({
      id: uuidv4(),
      auctionId: auction.id,
      bidderId: randomFromArray(buyers).id,
      amount: auction.basePrice + faker.number.int({ min: 10, max: 500 }),
      createdAt: faker.date.between({ from: auction.startTime, to: auction.endTime }),
    });
  }
  await prisma.bid.createMany({ data: bids, skipDuplicates: true });
};
""")

write_file("chatMessageGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateChatMessages = async (prisma: PrismaClient, count: number = 300) => {
  const users = await prisma.user.findMany();
  if (users.length < 2) return [];

  const messages = [];
  for (let i = 0; i < count; i++) {
    const sender = randomFromArray(users);
    let receiver = randomFromArray(users);
    while (receiver.id === sender.id) {
      receiver = randomFromArray(users);
    }
    messages.push({
      id: uuidv4(),
      senderId: sender.id,
      receiverId: receiver.id,
      content: faker.lorem.sentences(2),
      createdAt: faker.date.recent(),
    });
  }
  await prisma.chatMessage.createMany({ data: messages, skipDuplicates: true });
};
""")

write_file("wishlistItemGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateWishlistItems = async (prisma: PrismaClient, count: number = 100) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const products = await prisma.product.findMany();
  
  if (buyers.length === 0 || products.length === 0) return [];

  const wishlistItems = [];
  for (let i = 0; i < count; i++) {
    wishlistItems.push({
      id: uuidv4(),
      userId: randomFromArray(buyers).id,
      productId: randomFromArray(products).id,
      createdAt: new Date(),
    });
  }
  await prisma.wishlist.createMany({ data: wishlistItems, skipDuplicates: true });
};
""")

write_file("cartItemGenerator.ts", """import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomFromArray } from "../utils/generator";

export const generateCartItems = async (prisma: PrismaClient, count: number = 100) => {
  const buyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const products = await prisma.product.findMany();
  
  if (buyers.length === 0 || products.length === 0) return [];

  // First create carts for some buyers
  for (const buyer of buyers.slice(0, 20)) {
    await prisma.cart.upsert({
      where: { userId: buyer.id },
      update: {},
      create: { id: uuidv4(), userId: buyer.id },
    });
  }
  
  const carts = await prisma.cart.findMany();
  if (carts.length === 0) return;

  const cartItems = [];
  for (let i = 0; i < count; i++) {
    cartItems.push({
      id: uuidv4(),
      cartId: randomFromArray(carts).id,
      productId: randomFromArray(products).id,
      qty: faker.number.float({ min: 1, max: 10 }),
    });
  }
  await prisma.cartItem.createMany({ data: cartItems, skipDuplicates: true });
};
""")
