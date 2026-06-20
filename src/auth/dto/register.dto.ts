import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'ali_valiyev', description: 'Faqat harf, raqam va _' })
  @IsString()
  @MinLength(3, { message: "Foydalanuvchi nomi kamida 3 ta belgi bo'lishi kerak" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Faqat harf, raqam va _ ishlatish mumkin',
  })
  username: string;

  @ApiProperty({ example: 'StrongPass123', minLength: 8 })
  @IsString()
  @MinLength(8, { message: "Parol kamida 8 ta belgi bo'lishi kerak" })
  password: string;

  @ApiProperty({ example: 'student@example.com' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  email: string;

  @ApiProperty({ example: 'Ali' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Valiyev' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({ example: 'Toshkent' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'uz', description: 'Davlat kodi' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 15, minimum: 1, maximum: 31 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(31)
  birthDay: number;

  @ApiProperty({ example: 6, minimum: 1, maximum: 12 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  birthMonth: number;

  @ApiProperty({ example: 2000, minimum: 1940 })
  @Type(() => Number)
  @IsInt()
  @Min(1940)
  birthYear: number;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Universitet ID (Hanafiy fiqh fakulteti talabalari uchun)' })
  @IsOptional()
  @IsString()
  universityId?: string;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ example: 'O\'zbekiston', description: 'Fuqarolik' })
  @IsString()
  @MinLength(1)
  nationality: string;
}
