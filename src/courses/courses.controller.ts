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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  // --- Ommaviy endpointlar ---

  @Get()
  @ApiOperation({ summary: "E'lon qilingan kurslar ro'yxati (ommaviy)" })
  findPublished() {
    return this.coursesService.findPublished();
  }

  // Admin uchun — barcha kurslar (qoralama + e'lon qilingan).
  // ':id' dan oldin turishi shart (route to'qnashuvining oldini oladi).
  @Get('admin/list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: "Barcha kurslar — qoralama + e'lon qilingan (faqat ADMIN)",
  })
  findAllForAdmin() {
    return this.coursesService.findAllForAdmin();
  }

  @Get(':id')
  @ApiOperation({ summary: "Bitta kurs ma'lumoti (darslari bilan)" })
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // --- Himoyalangan endpointlar (TEACHER / ADMIN) ---

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Yangi kurs yaratish (faqat ADMIN)" })
  create(
    @CurrentUser('id') teacherId: string,
    @Body() dto: CreateCourseDto,
  ) {
    return this.coursesService.create(teacherId, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Kursni tahrirlash (faqat ADMIN)" })
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Kursni o'chirish (faqat ADMIN)" })
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
