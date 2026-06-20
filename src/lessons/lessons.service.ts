import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Lesson } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  // Dars (video) qo'shish — faqat ADMIN. Kurs mavjudligini tekshiradi.
  async create(courseId: string, dto: CreateLessonDto) {
    await this.ensureCourseExists(courseId);

    // order berilmasa — oxiriga qo'shamiz
    let order = dto.order;
    if (order === undefined) {
      const last = await this.prisma.lesson.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      order = (last?.order ?? 0) + 1;
    }

    return this.prisma.lesson.create({
      data: {
        courseId,
        title: dto.title,
        description: dto.description,
        videoUrl: dto.videoUrl,
        duration: dto.duration ?? 0,
        order,
        isPreview: dto.isPreview ?? false,
      },
    });
  }

  // Kurs darslari ro'yxati. videoUrl faqat preview darslarda qaytadi.
  // TODO: enrollments moduli qo'shilgach, yozilgan o'quvchilarga ham videoUrl ochiladi.
  async findByCourse(courseId: string) {
    await this.ensureCourseExists(courseId);
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
    return lessons.map((l) => this.maskVideo(l));
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Dars topilmadi');
    }
    return this.maskVideo(lesson);
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.ensureLessonExists(id);
    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.ensureLessonExists(id);
    await this.prisma.lesson.delete({ where: { id } });
    return { success: true };
  }

  // Dars progressini saqlash / darsni "tugatildi" deb belgilash.
  // Faqat kursga yozilgan foydalanuvchi uchun ishlaydi.
  async saveProgress(userId: string, lessonId: string, dto: SaveProgressDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, courseId: true },
    });
    if (!lesson) {
      throw new NotFoundException('Dars topilmadi');
    }

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lesson.courseId },
      },
      select: { id: true },
    });
    if (!enrollment) {
      throw new ForbiddenException('Avval ushbu kursga yozilishingiz kerak');
    }

    return this.prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        completed: dto.completed ?? false,
        watchedSeconds: dto.watchedSeconds ?? 0,
      },
      update: {
        ...(dto.completed !== undefined ? { completed: dto.completed } : {}),
        ...(dto.watchedSeconds !== undefined
          ? { watchedSeconds: dto.watchedSeconds }
          : {}),
      },
    });
  }

  // --- yordamchilar ---

  // Preview bo'lmagan darslarda videoUrl ni yashiramiz (ruxsatsiz ko'rishning oldini olish)
  private maskVideo(lesson: Lesson) {
    if (lesson.isPreview) return lesson;
    return { ...lesson, videoUrl: null, locked: true };
  }

  private async ensureCourseExists(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }
  }

  private async ensureLessonExists(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!lesson) {
      throw new NotFoundException('Dars topilmadi');
    }
  }
}
