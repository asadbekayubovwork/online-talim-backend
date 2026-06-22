import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Aqida darslari' })
  @IsString()
  @MinLength(2)
  name: string;
}
