import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ description: 'Yozilmoqchi bo\'lgan kurs ID' })
  @IsString()
  @IsUUID()
  courseId: string;
}
