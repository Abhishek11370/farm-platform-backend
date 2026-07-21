const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.user.groupBy({
  by: ['role'],
  _count: { _all: true }
})
.then(r => console.log(r))
.finally(() => prisma.$disconnect());
