import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const farmerPass = await bcrypt.hash("farmer123", 10);
  const buyerPass = await bcrypt.hash("buyer123", 10);
  const deliveryPass = await bcrypt.hash("delivery123", 10);

  const [admin, farmer, buyer, delivery] = await Promise.all([
    prisma.user.upsert({
      where: { email: "admin@farm.com" },
      update: {},
      create: { name: "Admin", email: "admin@farm.com", password: adminPass, role: "ADMIN" }
    }),
    prisma.user.upsert({
      where: { email: "farmer@farm.com" },
      update: {},
      create: { name: "Farmer", email: "farmer@farm.com", password: farmerPass, role: "FARMER" }
    }),
    prisma.user.upsert({
      where: { email: "buyer@farm.com" },
      update: {},
      create: { name: "Buyer", email: "buyer@farm.com", password: buyerPass, role: "BUYER" }
    }),
    prisma.user.upsert({
      where: { email: "delivery@farm.com" },
      update: {},
      create: { name: "Delivery", email: "delivery@farm.com", password: deliveryPass, role: "DELIVERY" }
    })
  ]);

  const cat = await prisma.category.upsert({
    where: { name: "Vegetables" },
    update: {},
    create: { name: "Vegetables" }
  });

  const sub = await prisma.subCategory.upsert({
    where: { name_categoryId: { name: "Tomato", categoryId: cat.id } },
    update: {},
    create: { name: "Tomato", categoryId: cat.id }
  });

  const unit = await prisma.unit.upsert({ where: { name: "KG" }, update: {}, create: { name: "KG" } });
  const grade = await prisma.grade.upsert({ where: { name: "A" }, update: {}, create: { name: "A" } });

  const p = await prisma.product.create({
    data: {
      title: "Fresh Tomatoes",
      description: "Farm fresh tomatoes",
      price: 30,
      quantity: 200,
      unitId: unit.id,
      gradeId: grade.id,
      subCategoryId: sub.id,
      ownerId: farmer.id,
      latitude: 23.0225,
      longitude: 72.5714
    }
  });

  await prisma.auction.create({
    data: {
      productId: p.id,
      basePrice: 25,
      startTime: new Date(Date.now() - 5 * 60 * 1000),
      endTime: new Date(Date.now() + 60 * 60 * 1000),
      status: "LIVE"
    }
  });

  console.log("Seed done.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());