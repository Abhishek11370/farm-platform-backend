// prisma/seed/constants/productData.ts
export const veges = [
  "Potato",
  "Tomato",
  "Onion",
  "Garlic",
  "Ginger",
  "Brinjal",
  "Chilli",
  "Spinach",
] as const;

export const fruits = [
  "Mango",
  "Banana",
  "Orange",
  "Papaya",
  "Grapes",
  "Guava",
] as const;

export const grains = [
  "Wheat",
  "Rice",
  "Bajra",
  "Jowar",
  "Maize",
] as const;

export const pulses = ["Chana", "Moong", "Toor", "Urad"] as const;

export const cashCrops = ["Cotton", "Sugarcane"] as const;

export const spices = ["Turmeric", "Coriander", "Cumin", "Fenugreek"] as const;

export const allProducts = [...veges, ...fruits, ...grains, ...pulses, ...cashCrops, ...spices] as const;
