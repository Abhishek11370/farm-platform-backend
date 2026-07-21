import { PrismaClient, Role, OrderStatus, AuctionStatus, NotificationType, CouponDiscountType, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import 'dotenv/config';

const prisma = new PrismaClient();

const PRODUCT_NAMES = [
  "Rice", "Wheat", "Tomato", "Potato", "Onion", "Carrot", "Garlic", "Ginger", "Corn", "Maize",
  "Cotton", "Sugarcane", "Groundnut", "Soybean", "Millet", "Chili", "Brinjal", "Cabbage", "Cauliflower", "Capsicum",
  "Apple", "Banana", "Mango", "Orange", "Guava", "Papaya", "Lemon", "Cucumber", "Spinach", "Peas",
  "Pomegranate", "Grapes", "Watermelon", "Muskmelon", "Pineapple", "Strawberry", "Blueberry", "Blackberry", "Raspberry", "Avocado"
];

async function main() {
  console.log("🌱 Starting EXACT count seed process...");
  
  await prisma.auditLog.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.farmerVerification.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.deliveryEarning.deleteMany();
  await prisma.deliveryAssignment.deleteMany();
  await prisma.transactionLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash("password123", 10);

  const admins = [];
  for (let i = 0; i < 3; i++) {
    admins.push(await prisma.user.create({
      data: { name: `Admin ${i+1}`, email: `admin${i+1}@example.com`, phone: `100000000${i}`, password: defaultPassword, role: Role.ADMIN, isBlocked: false }
    }));
  }
  const buyers = [];
  for (let i = 0; i < 15; i++) {
    buyers.push(await prisma.user.create({
      data: { name: `Buyer ${i+1}`, email: `buyer${i+1}@example.com`, phone: `20000000${i.toString().padStart(2, '0')}`, password: defaultPassword, role: Role.BUYER, isBlocked: false }
    }));
  }
  const farmers = [];
  for (let i = 0; i < 15; i++) {
    farmers.push(await prisma.user.create({
      data: { name: `Farmer ${i+1}`, email: `farmer${i+1}@example.com`, phone: `30000000${i.toString().padStart(2, '0')}`, password: defaultPassword, role: Role.FARMER, isBlocked: false }
    }));
  }
  const deliveries = [];
  for (let i = 0; i < 5; i++) {
    deliveries.push(await prisma.user.create({
      data: { name: `Delivery ${i+1}`, email: `delivery${i+1}@example.com`, phone: `400000000${i}`, password: defaultPassword, role: Role.DELIVERY, isBlocked: false }
    }));
  }

  const categories = [];
  for (let i = 0; i < 8; i++) {
    categories.push(await prisma.category.create({ data: { name: `Category ${i+1}` } }));
  }

  const subCategories = [];
  for (let i = 0; i < 16; i++) {
    subCategories.push(await prisma.subCategory.create({ data: { name: `SubCategory ${i+1}`, categoryId: categories[i % 8].id } }));
  }

  const units = [];
  for (let i = 0; i < 8; i++) {
    units.push(await prisma.unit.create({ data: { name: `Unit ${i+1}` } }));
  }

  const products = [];
  for (let i = 0; i < 40; i++) {
    products.push(await prisma.product.create({
      data: {
        title: PRODUCT_NAMES[i],
        description: `Description for ${PRODUCT_NAMES[i]}`,
        price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
        quantity: faker.number.int({ min: 10, max: 500 }),
        ownerId: farmers[i % 15].id,
        unitId: units[i % 8].id,
        subCategoryId: subCategories[i % 16].id,
        images: {
          create: [
            { imageUrl: `https://loremflickr.com/400/400/${PRODUCT_NAMES[i].toLowerCase()}`, isPrimary: true },
            { imageUrl: `https://loremflickr.com/400/400/${PRODUCT_NAMES[i].toLowerCase()}-2`, isPrimary: false },
            { imageUrl: `https://loremflickr.com/400/400/${PRODUCT_NAMES[i].toLowerCase()}-3`, isPrimary: false }
          ]
        }
      }
    }));
  }

  const orders = [];
  for (let i = 0; i < 45; i++) {
    const p1 = products[(i * 2) % 40];
    const p2 = products[(i * 2 + 1) % 40];
    const totalAmount = p1.price + p2.price;
    const order = await prisma.order.create({
      data: {
        buyerId: buyers[i % 15].id,
        status: faker.helpers.arrayElement(Object.values(OrderStatus)),
        totalAmount: totalAmount,
        items: {
          create: [
            { productId: p1.id, qty: 1, price: p1.price },
            { productId: p2.id, qty: 1, price: p2.price }
          ]
        }
      }
    });
    orders.push(order);
  }

  const auctions = [];
  for (let i = 0; i < 25; i++) {
    const status = i < 10 ? AuctionStatus.LIVE : AuctionStatus.CLOSED;
    auctions.push(await prisma.auction.create({
      data: {
        productId: products[i % 40].id,
        startTime: new Date(),
        endTime: new Date(Date.now() + 86400000),
        basePrice: products[i % 40].price,
        status: status
      }
    }));
  }
  
  for (let i = 0; i < 40; i++) {
    await prisma.bid.create({
      data: {
        auctionId: auctions[i % 25].id,
        bidderId: buyers[i % 15].id,
        amount: auctions[i % 25].basePrice + (i * 10)
      }
    });
  }

  for (let i = 0; i < 45; i++) {
    const payment = await prisma.payment.create({
      data: {
        orderId: orders[i].id,
        razorpayOrderId: `order_${i}`,
        status: 'PAID',
        amount: orders[i].totalAmount
      }
    });
    await prisma.transactionLog.create({
      data: {
        paymentId: payment.id,
        type: 'CREDIT',
        status: 'SUCCESS'
      }
    });
  }

  const deliveredOrders = [];
  for (let i = 0; i < 30; i++) {
    const delivery = await prisma.deliveryAssignment.create({
      data: {
        orderId: orders[i].id,
        agentId: deliveries[i % 5].id,
        status: 'DELIVERED'
      }
    });
    deliveredOrders.push(delivery);
  }

  for (let i = 0; i < 30; i++) {
    await prisma.review.create({
      data: {
        productId: products[i % 40].id,
        buyerId: buyers[i % 15].id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: "Great product!"
      }
    });
  }

  for (let i = 0; i < 25; i++) {
    await prisma.wishlist.create({
      data: {
        userId: buyers[i % 15].id,
        productId: products[i % 40].id
      }
    });
  }

  for (let i = 0; i < 15; i++) {
    const numItems = i < 5 ? 2 : (i < 15 ? 1 : 0);
    if (numItems > 0) {
      const itemsData = [];
      for(let j=0; j<numItems; j++) {
        itemsData.push({ productId: products[(i+j) % 40].id, qty: 1 });
      }
      await prisma.cart.create({
        data: {
          userId: buyers[i].id,
          items: {
            create: itemsData
          }
        }
      });
    }
  }

  for (let i = 0; i < 40; i++) {
    await prisma.notification.create({
      data: {
        userId: buyers[i % 15].id,
        title: `Notification ${i+1}`,
        message: `Message ${i+1}`,
        type: NotificationType.ORDER
      }
    });
  }

  const pairs = [];
  for (let i = 0; i < 15; i++) {
    pairs.push({ sender: buyers[i % 15].id, receiver: farmers[i % 15].id });
  }
  for (let i = 0; i < 50; i++) {
    const pair = pairs[i % 15];
    await prisma.chatMessage.create({
      data: {
        senderId: pair.sender,
        receiverId: pair.receiver,
        content: `Message ${i+1}`
      }
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.blog.create({
      data: {
        title: `Blog Post ${i+1}`,
        content: `Content for blog ${i+1}`,
        authorId: admins[0].id
      }
    });
  }

  for (let i = 0; i < 5; i++) {
    await prisma.banner.create({
      data: {
        title: `Banner ${i+1}`,
        imageUrl: `https://loremflickr.com/1200/400/farm`
      }
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.fAQ.create({
      data: {
        question: `Question ${i+1}?`,
        answer: `Answer ${i+1}`
      }
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.coupon.create({
      data: {
        code: `COUPON${i+1}`,
        discountType: CouponDiscountType.PERCENTAGE,
        discountValue: 10,
        expiryDate: new Date(Date.now() + 86400000 * 30)
      }
    });
  }

  for (let i = 0; i < 10; i++) {
    await prisma.supportTicket.create({
      data: {
        userId: buyers[i % 15].id,
        subject: `Ticket ${i+1}`,
        message: `Need help with order ${i+1}`,
        status: 'OPEN'
      }
    });
  }

  for (let i = 0; i < 50; i++) {
    await prisma.activity.create({
      data: {
        userId: farmers[i % 15].id,
        action: 'LOGIN',
        entityType: 'USER'
      }
    });
  }

  for (let i = 0; i < 50; i++) {
    await prisma.auditLog.create({
      data: {
        userId: admins[0].id,
        action: 'SYSTEM_START',
        entity: 'SYSTEM'
      }
    });
  }

  console.log("✅ Exactly matched all required counts!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
