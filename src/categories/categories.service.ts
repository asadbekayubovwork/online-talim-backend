import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
