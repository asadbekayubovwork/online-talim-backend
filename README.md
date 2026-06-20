# Online Ta'lim — Backend

Videokurslar platformasi backend API (NestJS + Prisma + PostgreSQL).

## Texnologiyalar

- **NestJS** (TypeScript) — modulli backend framework
- **PostgreSQL** + **Prisma ORM** — ma'lumotlar bazasi
- **JWT** (access + refresh) — autentifikatsiya
- **Swagger** — API hujjatlari (`/docs`)

## Talablar (Prerequisites)

Loyihani ishga tushirishdan oldin quyidagilar o'rnatilgan bo'lishi kerak:

- **Node.js** v20+ va **npm**
- **Docker Desktop** (PostgreSQL va Redis konteynerlari uchun)

> Docker o'rnatilgan, lekin ishlamayotgan bo'lsa — avval **Docker Desktop**ni ishga tushiring (ekranning pastki o'ng burchagida belgisi paydo bo'lib, "Engine running" holatiga o'tishini kuting).

## Ishga tushirish (birinchi marta)

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. .env faylini tayyorlash (.env.example dan nusxa oling)
cp .env.example .env

# 3. Bazani ko'tarish (PostgreSQL + Redis)
docker compose up -d

# 4. Migratsiyalarni qo'llash + Prisma client generatsiyasi
npm run prisma:migrate     # jadvallarni yaratadi
npm run prisma:generate    # Prisma client ni generatsiya qiladi

# 5. Admin foydalanuvchisini yaratish (login: admin, parol: admin)
npm run db:seed

# 6. Serverni ishga tushirish (hot-reload bilan)
npm run start:dev
```

> **Admin kirishi:** standart login `admin`, parol `admin`. Buni `.env` da `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` orqali o'zgartirish mumkin. Productionda albatta o'zgartiring.

Server tayyor bo'lgach:

- **API:** http://localhost:4791/api
- **Swagger hujjatlar:** http://localhost:4791/docs

## Keyingi ishga tushirishlar

Birinchi sozlashdan keyin har safar faqat quyidagilar yetarli:

```bash
docker compose up -d     # konteynerlar o'chiq bo'lsa
npm run start:dev
```

To'xtatish:

```bash
# serverni: terminalda Ctrl + C
docker compose stop      # konteynerlarni to'xtatish (ma'lumot saqlanadi)
docker compose down      # konteynerlarni o'chirish (volume saqlanadi)
```

## Foydali buyruqlar

| Buyruq | Tavsif |
|--------|--------|
| `npm run start:dev` | Dev server (hot-reload) |
| `npm run start:prod` | Production server (`dist` dan) |
| `npm run build` | TypeScript ni kompilyatsiya qilish |
| `npm run prisma:migrate` | Yangi migratsiya yaratish/qo'llash |
| `npm run prisma:generate` | Prisma client generatsiyasi |
| `npm run prisma:studio` | Bazani brauzerda ko'rish (GUI) |

## Muhit o'zgaruvchilari (.env)

| O'zgaruvchi | Tavsif | Standart |
|-------------|--------|----------|
| `PORT` | Server porti | `4791` |
| `DATABASE_URL` | PostgreSQL ulanish manzili | `postgresql://postgres:postgres@localhost:5432/online_talim` |
| `JWT_ACCESS_SECRET` | Access token kaliti | — |
| `JWT_ACCESS_EXPIRES` | Access token muddati | `15m` |
| `JWT_REFRESH_SECRET` | Refresh token kaliti | — |
| `JWT_REFRESH_EXPIRES` | Refresh token muddati | `7d` |

> ⚠️ Productionda `JWT_*_SECRET` larni albatta o'zgartiring.

## Mavjud modullar

| Modul | Tavsif |
|-------|--------|
| `auth` | Ro'yxatdan o'tish, login (username+parol), refresh, logout (JWT) |
| `users` | Profil (`/me`), foydalanuvchilar ro'yxati (ADMIN) |
| `courses` | Kurslar CRUD (TEACHER/ADMIN yaratadi, hammasi ko'radi) |

## API tezkor misol

```bash
# Ro'yxatdan o'tish
curl -X POST http://localhost:4791/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ali_valiyev","password":"StrongPass123","email":"ali@test.com","firstName":"Ali","lastName":"Valiyev","birthDay":15,"birthMonth":6,"birthYear":2000,"nationality":"Ozbekiston"}'

# Login (username + parol)
curl -X POST http://localhost:4791/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ali_valiyev","password":"StrongPass123"}'
```

## Swagger / OpenAPI ni frontendga berish

Frontend dasturchisiga API spetsifikatsiyasini berishning ikki yo'li:

**1. Jonli URL (server ishlab turganda):**

- Swagger UI: http://localhost:4791/docs
- OpenAPI JSON: http://localhost:4791/docs-json

JSON ni yuklab olish:
```bash
curl http://localhost:4791/docs-json -o openapi.json
```

**2. Fayl sifatida generatsiya qilish (server kerak emas):**
```bash
npm run swagger:json
```
Bu loyiha ildizida `openapi.json` faylini yaratadi. Shu faylni frontendga berishingiz mumkin — undan TypeScript turlari/axios client avtomatik generatsiya qilsa bo'ladi (masalan `openapi-typescript` yoki `orval` orqali).

## Keyingi qadamlar (rejada)

- `lessons` — darslar + video (Mux / S3 signed URL)
- `enrollments` — kursga yozilish
- `payments` — Click / Payme integratsiyasi
- `progress` — o'quvchi progressi
- `reviews` — sharhlar va reyting
