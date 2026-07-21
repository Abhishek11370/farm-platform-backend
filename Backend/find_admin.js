const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany({ where: { role: 'ADMIN' }, select: { email: true, name: true, password: true }, take: 3 })
  .then(u => console.log(JSON.stringify(u, null, 2)))
  .finally(() => p.$disconnect());
