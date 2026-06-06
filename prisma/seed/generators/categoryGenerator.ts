import { PrismaClient } from "@prisma/client";
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
