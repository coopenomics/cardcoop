import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

/**
 * Создает и инициализирует тестовое приложение
 * с настройками, аналогичными рабочему приложению
 */
export async function createTestingApp(): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
}> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Применяем глобальные pipes, как в основном приложении
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();

  return { app, moduleFixture };
}

/**
 * Очищает mock-и Jest после тестов
 */
export function clearJestMocks(): void {
  jest.resetAllMocks();
  jest.clearAllMocks();
}
