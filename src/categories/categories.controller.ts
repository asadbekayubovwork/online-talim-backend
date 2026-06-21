import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: "Kategoriyalar ro'yxati — e'lon qilingan kurslar soni bilan (ommaviy)",
  })
  findAll() {
    return this.categoriesService.findAllWithCounts();
  }
}
