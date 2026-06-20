import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'JavaScript noldan' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'Ushbu kursda JavaScript asoslarini o\'rganasiz...' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({ example: 199000, description: "Narx (so'mda). 0 = bepul" })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ enum: CourseLevel, default: CourseLevel.BEGINNER })
  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @ApiPropertyOptional({ description: 'Kategoriya ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: "O'qituvchi (User) ID. Berilmasa, kursni yaratgan admin biriktiriladi.",
  })
  @IsOptional()
  @IsString()
  teacherId?: string;
}
