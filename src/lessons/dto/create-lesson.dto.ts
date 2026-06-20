import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Kirish darsi' })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({ example: 'Ushbu darsda kursning umumiy tuzilishi...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://www.youtube.com/watch?v=xxxx',
    description: 'Video havolasi (URL)',
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({ example: 600, description: 'Davomiyligi (sekundlarda)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 1, description: 'Darslar tartibi' })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({
    example: false,
    description: "Bepul ko'rish (ro'yxatdan o'tmaganlar uchun ham ochiq)",
  })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;
}
