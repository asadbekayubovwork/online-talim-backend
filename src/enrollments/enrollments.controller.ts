import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  // Kursga yozilish.
  @Post()
  @ApiOperation({ summary: 'Joriy foydalanuvchini kursga yozishsh' })
  enroll(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.enroll(userId, dto.courseId);
  }

  // Foydalanuvchining o'rganayotgan va tugatgan kurslari (progress bilan).
  @Get('my-courses')
  @ApiOperation({
    summary: "Joriy foydalanuvchining yozilgan kurslari (progress bilan)",
  })
  getMyCourses(@CurrentUser('id') userId: string) {
    return this.enrollmentsService.getMyCourses(userId);
  }
}
