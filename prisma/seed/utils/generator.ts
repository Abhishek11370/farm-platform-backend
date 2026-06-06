// prisma/seed/utils/generator.ts
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export const generateUUID = () => uuidv4();

export const randomFromArray = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const randomPhone = () => faker.phone.number();

export const randomEmail = (name: string) =>
  `${name.replace(/\s+/g, ".").toLowerCase()}@example.com`;

export const randomImageUrl = () =>
  faker.image.urlLoremFlickr({
    category: "nature",
    width: 640,
    height: 480,
  });

export const randomFutureDate = (daysAhead: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date;
};

export const randomPastDate = (daysBack: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

export const randomBool = () => Math.random() < 0.5;
