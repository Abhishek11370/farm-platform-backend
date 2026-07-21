import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import 'dotenv/config';

const createDemoUser = async (prisma: PrismaClient, email: string, password: string, role: Role) => {
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed, role },
    create: { name: email.split('@')[0], email, password: hashed, role }
  });
};

const main = async () => {
  const prisma = new PrismaClient();
  try {
    console.log("🌱 Starting demo user seed...");
    
    // Create demo credentials if they do not exist
    await createDemoUser(prisma, process.env.DEMO_USER_ADMIN_EMAIL!, process.env.DEMO_USER_ADMIN_PASSWORD!, Role.ADMIN);
    await createDemoUser(prisma, process.env.DEMO_USER_USER_EMAIL!, process.env.DEMO_USER_USER_PASSWORD!, Role.BUYER);
    await createDemoUser(prisma, process.env.DEMO_USER_FARMER_EMAIL!, process.env.DEMO_USER_FARMER_PASSWORD!, Role.FARMER);
    
    const demoEmails = [
      process.env.DEMO_USER_ADMIN_EMAIL!,
      process.env.DEMO_USER_USER_EMAIL!,
      process.env.DEMO_USER_FARMER_EMAIL!
    ];
    const demoUsers = await prisma.user.findMany({ where: { email: { in: demoEmails } } });
    console.log('✅ Demo users:', demoUsers.map(u => ({ email: u.email, role: u.role })));

    console.log("✅ Seed process completed successfully!");
  } catch (error) {
    console.error("❌ Seed process failed:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
