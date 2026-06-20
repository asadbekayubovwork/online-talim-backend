import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Standart admin (kerak bo'lsa .env orqali o'zgartiriladi)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@admin.com';

async function main() {
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { username: ADMIN_USERNAME },
    update: { password: hash, role: Role.ADMIN, isActive: true },
    create: {
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hash,
      firstName: 'Admin',
      lastName: 'Admin',
      role: Role.ADMIN,
    },
  });

  // eslint-disable-next-line no-console
  console.log(
    `✅ Admin tayyor — login: "${admin.username}", parol: "${ADMIN_PASSWORD}"`,
  );
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Seed xatosi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
