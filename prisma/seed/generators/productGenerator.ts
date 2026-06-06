import { PrismaClient } from "@prisma/client";
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
