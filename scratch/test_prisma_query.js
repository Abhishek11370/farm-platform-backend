const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:%40Ashu1137@localhost:5432/farm_platform?schema=public'
      }
    }
  });

  try {
    const user = await prisma.user.findUnique({
      where: { id: 'cmql3yu9c0000z5s1na9bjr0c' }
    });
    console.log('Query result:', user);
  } catch (e) {
    console.error('Prisma Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
