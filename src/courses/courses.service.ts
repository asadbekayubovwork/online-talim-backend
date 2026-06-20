import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const TEACHER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
};

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  // Kurs yaratish — faqat ADMIN. teacherId DTO da berilmasa, yaratuvchi (admin) biriktiriladi.
  async create(creatorId: string, dto: CreateCourseDto) {
    const slug = `${slugify(dto.title)}-${Date.now().toString(36)}`;
    return this.prisma.course.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        thumbnail: dto.thumbnail,
        price: dto.price ?? 0,
        level: dto.level,
        categoryId: dto.categoryId,
        teacherId: dto.teacherId ?? creatorId,
      },
    });
  }

  // Ommaviy ro'yxat — faqat e'lon qilingan kurslar
  findPublished() {
    return this.prisma.course.findMany({
      where: { isPublished: true },
      include: {
        teacher: { select: TEACHER_SELECT },
        category: { select: { id: true, name: true } },
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin ro'yxati — barcha kurslar (qoralama + e'lon qilingan)
  findAllForAdmin() {
    return this.prisma.course.findMany({
      include: {
        teacher: { select: TEACHER_SELECT },
        category: { select: { id: true, name: true } },
        _count: { select: { lessons: true, enrollments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: { select: TEACHER_SELECT },
        category: { select: { id: true, name: true } },
        lessons: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            isPreview: true,
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.ensureExists(id);
    return this.prisma.course.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.course.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
  }
}
