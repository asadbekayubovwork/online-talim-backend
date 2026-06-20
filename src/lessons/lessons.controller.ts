import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@ApiTags('lessons')
@Controller()
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  // --- Ommaviy: ko'rish ---

  @Get('courses/:courseId/lessons')
  @ApiOperation({ summary: "Kurs darslari ro'yxati" })
  findByCourse(@Param('courseId') courseId: string) {
    return this.lessonsService.findByCourse(courseId);
  }

  @Get('lessons/:id')
  @ApiOperation({ summary: "Bitta dars ma'lumoti" })
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  // --- Himoyalangan: o'quvchi progressini saqlash ---

  @Post('lessons/:id/progress')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Dars progressini saqlash / darsni tugatildi deb belgilash",
  })
  saveProgress(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: SaveProgressDto,
  ) {
    return this.lessonsService.saveProgress(userId, id, dto);
  }

  // --- Himoyalangan: faqat ADMIN dars/video qo'shadi ---

  @Post('courses/:courseId/lessons')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Kursga dars (video) qo'shish (faqat ADMIN)" })
  create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.create(courseId, dto);
  }

  @Patch('lessons/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Darsni tahrirlash (faqat ADMIN)" })
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete('lessons/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Darsni o'chirish (faqat ADMIN)" })
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
