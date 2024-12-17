import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { writeFileSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Включаем глобальную валидацию
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
      // forbidUnknownValues: true, // Ошибка, если объект отсутствует или некорректен
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CARD.COOP')
    .setDescription('API для авторизации и управления пользователями')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3015')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  // Сохранение схемы в файл
  const outputPath = join(__dirname, '..', 'swagger.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');

  SwaggerModule.setup('api', app, document);

  await app.listen(3015);
}
bootstrap();
