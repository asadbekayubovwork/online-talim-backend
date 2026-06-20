import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { swaggerConfig } from '../src/swagger.config';

// OpenAPI (Swagger) spetsifikatsiyasini openapi.json fayliga yozadi.
// Serverni ishga tushirmaydi — faqat hujjatni generatsiya qiladi.
async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  const outPath = join(process.cwd(), 'openapi.json');
  writeFileSync(outPath, JSON.stringify(document, null, 2), 'utf-8');

  await app.close();
  // eslint-disable-next-line no-console
  console.log(`✅ OpenAPI spec yozildi: ${outPath}`);
}

generate();
