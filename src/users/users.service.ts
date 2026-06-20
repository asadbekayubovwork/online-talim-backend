import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const PUBLIC_USER_FIELDS = {
  id: true,
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  avatarUrl: true,
  city: true,
  country: true,
  birthDate: true,
  phone: true,
  universityId: true,
  whatsapp: true,
  nationality: true,
  isActive: true,
  createdAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: PUBLIC_USER_FIELDS,
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    return user;
  }

  findAll() {
    return this.prisma.user.findMany({ select: PUBLIC_USER_FIELDS });
  }
}
