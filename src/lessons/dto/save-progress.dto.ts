import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class SaveProgressDto {
  @ApiPropertyOptional({
    description: 'Dars tugatildimi (tugatildi deb belgilash uchun true)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({
    description: 'Ko\'rilgan vaqt (sekundlarda) — videoning qaytadan davom etishi uchun',
    example: 320,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  watchedSeconds?: number;
}
