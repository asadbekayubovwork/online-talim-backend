import { DocumentBuilder } from '@nestjs/swagger';

// Swagger konfiguratsiyasi — main.ts va openapi generatsiya skriptida ishlatiladi
export const swaggerConfig = new DocumentBuilder()
  .setTitle("Online Ta'lim API")
  .setDescription('Videokurslar platformasi backend API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
