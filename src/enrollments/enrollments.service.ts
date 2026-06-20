import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const TEACHER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
};

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  // Foydalanuvchini kursga yozish.
  async enroll(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, isPublished: true },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
    if (!course.isPublished) {
      throw new BadRequestException("Kurs hali e'lon qilinmagan");
    }

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Siz allaqachon bu kursga yozilgansiz');
    }

    return this.prisma.enrollment.create({
      data: { userId, courseId },
    });
  }

  // Foydalanuvchining yozilgan kurslari — har biri uchun progress bilan.
  // /my-courses sahifasi uchun: o'rganayotgan va tugatgan kurslarga ajratilgan.
  async getMyCourses(userId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            teacher: { select: TEACHER_SELECT },
            category: { select: { id: true, name: true } },
            _count: { select: { lessons: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (enrollments.length === 0) {
      return { inProgress: [], completed: [], total: 0 };
    }

    const courseIds = enrollments.map((e) => e.courseId);

    // Shu foydalanuvchining ushbu kurslar bo'yicha tugatilgan darslari.
    const completedProgress = await this.prisma.progress.findMany({
      where: {
        userId,
        completed: true,
        lesson: { courseId: { in: courseIds } },
      },
      select: { lesson: { select: { courseId: true } } },
    });

    // Kurs bo'yicha tugatilgan darslar sonini hisoblaymiz.
    const completedByCourse = new Map<string, number>();
    for (const p of completedProgress) {
      const cid = p.lesson.courseId;
      completedByCourse.set(cid, (completedByCourse.get(cid) ?? 0) + 1);
    }

    const inProgress: ReturnType<typeof this.buildItem>[] = [];
    const completed: ReturnType<typeof this.buildItem>[] = [];

    for (const enrollment of enrollments) {
      const item = this.buildItem(enrollment, completedByCourse);
      if (item.isCompleted) {
        completed.push(item);
      } else {
        inProgress.push(item);
      }
    }

    return {
      inProgress,
      completed,
      total: enrollments.length,
    };
  }

  private buildItem(
    enrollment: {
      createdAt: Date;
      course: {
        _count: { lessons: number };
        teacher: unknown;
        category: unknown;
      } & Record<string, unknown>;
    },
    completedByCourse: Map<string, number>,
  ) {
    const { course } = enrollment;
    const totalLessons = course._count.lessons;
    const completedLessons = completedByCourse.get(course.id as string) ?? 0;
    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;
    const isCompleted = totalLessons > 0 && completedLessons >= totalLessons;

    // _count ni javobdan chiqarib, toza kurs obyektini qoldiramiz.
    const { _count, ...courseData } = course;

    return {
      ...courseData,
      enrolledAt: enrollment.createdAt,
      totalLessons,
      completedLessons,
      progressPercent,
      isCompleted,
    };
  }
}
