import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { swaggerConfig } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO da bo'lmagan maydonlarni o'chiradi
      forbidNonWhitelisted: true,
      transform: true, // payloadni DTO turiga o'giradi
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 4791;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 Server: http://localhost:${port}/api  |  Docs: /docs`);
}
bootstrap();
