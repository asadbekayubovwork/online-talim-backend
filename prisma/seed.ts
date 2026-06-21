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

  // Yo'nalishlar (kategoriyalar). Slug'lar frontend tarjima kalitlariga mos
  // (coursesSection.categories.{fiqh|aqida|tazkiya}). upsert idempotent.
  const categories = [
    { name: "Hanafiy fiqhi va uning usuli darslari", slug: 'fiqh' },
    { name: 'Aqida darslari', slug: 'aqida' },
    { name: 'Tazkiya darslari', slug: 'tazkiya' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: category,
    });
  }

  // eslint-disable-next-line no-console
  console.log(`✅ ${categories.length} ta kategoriya tayyor`);
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
