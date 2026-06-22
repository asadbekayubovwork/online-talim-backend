import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Barcha kategoriyalar — har biriga e'lon qilingan kurslar soni bilan.
  // Landing tablari count > 0 bo'lganlarni ko'rsatadi; admin forma hammasini ishlatadi.
  async findAllWithCounts() {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // E'lon qilingan kurslarni kategoriya bo'yicha sanaymiz.
    const grouped = await this.prisma.course.groupBy({
      by: ['categoryId'],
      where: { isPublished: true, categoryId: { not: null } },
      _count: { _all: true },
    });

    const countByCategory = new Map<string, number>();
    for (const g of grouped) {
      if (g.categoryId) {
        countByCategory.set(g.categoryId, g._count._all);
      }
    }

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      courseCount: countByCategory.get(c.id) ?? 0,
    }));
  }

  // Yangi kategoriya — faqat ADMIN. Slug nomdan avtomatik yaratiladi.
  async create(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const slug = slugify(name) || `kategoriya-${Date.now().toString(36)}`;

    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException("Bunday yo'nalish allaqachon mavjud");
    }

    return this.prisma.category.create({ data: { name, slug } });
  }

  // Tahrirlash — nom yangilanadi (slug barqaror qoladi, tarjima mosligini buzmaslik uchun).
  async update(id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(id);

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      const clash = await this.prisma.category.findFirst({
        where: { name, NOT: { id } },
        select: { id: true },
      });
      if (clash) {
        throw new ConflictException("Bu nomli yo'nalish allaqachon mavjud");
      }
      return this.prisma.category.update({ where: { id }, data: { name } });
    }

    return this.prisma.category.findUnique({ where: { id } });
  }

  // O'chirish — kurslarning categoryId si NULL ga o'tadi (optional relation).
  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!category) {
      throw new NotFoundException("Yo'nalish topilmadi");
    }
  }
}
