/**
 * Этот файл содержит функции для настройки тестового окружения
 */

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Создает тестовое приложение для e2e тестов
 * @returns Настроенное NestJS приложение
 */
export async function setupTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}

/**
 * Генерирует моковые значения для тестов
 */
export function generateTestData() {
  return {
    email: `test-${Math.random().toString(36).substring(7)}@example.com`,
    password: 'password123',
    hashKey: 'hashed_password_example', // В реальном приложении это хешируется клиентом
    salt: 'test-salt-' + Math.random().toString(36).substring(7),
    verificationCode: '123456',
  };
}
