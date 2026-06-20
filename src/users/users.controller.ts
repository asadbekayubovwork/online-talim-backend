import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: "Joriy foydalanuvchi ma'lumotlari (profil)" })
  me(@CurrentUser('id') userId: string) {
    return this.usersService.findMe(userId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Barcha foydalanuvchilar ro'yxati (faqat ADMIN)" })
  findAll() {
    return this.usersService.findAll();
  }
}
