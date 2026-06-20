import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ali_valiyev' })
  @IsString()
  @MinLength(1)
  username: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString()
  password: string;
}
