import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { v4 } from 'uuid';

/**
 * Тесты для контроллера авторизации
 * Проверяет процессы регистрации, подтверждения email, входа в систему,
 * обновления токена и выхода из системы
 */
describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    email: `test-${v4()}@example.com`,
    password: 'password123',
  };

  let accessToken: string;
  let refreshToken: string;
  let registrationUuid: string;
  let verificationCode = '123456';
  let salt: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * Тест процесса регистрации
   */
  describe('Регистрация', () => {
    it('POST /auth/initiate-registration должен начать процесс регистрации', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/initiate-registration')
        .send({
          email: testUser.email,
          privacy_accepted: true,
        })
        .expect(201);

      // Сохраняем UUID для использования в следующих тестах
      expect(response.body).toHaveProperty('uuid');
      expect(response.body).toHaveProperty('salt');
      registrationUuid = response.body.uuid;
      salt = response.body.salt;
    });

    it('POST /auth/verify-email должен подтвердить email', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({
          uuid: registrationUuid,
          code: verificationCode,
          email: testUser.email,
        })
        .expect(201);

      expect(response.body).toHaveProperty('verified');
      expect(response.body.verified).toBe(true);
    });

    it('POST /auth/complete-registration должен завершить регистрацию', async () => {
      // Генерируем хеш ключ (в реальности это делает клиент)
      const hashKey = 'hashed_password_example';

      const response = await request(app.getHttpServer())
        .post('/auth/complete-registration')
        .send({
          uuid: registrationUuid,
          email: testUser.email,
          hash_key: hashKey,
          salt: salt, // Передаем соль явно
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });
  });

  /**
   * Тест процесса входа в систему
   */
  describe('Вход в систему', () => {
    it('POST /auth/initiate-login должен начать процесс входа', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/initiate-login')
        .send({
          email: testUser.email,
        })
        .expect(201);

      expect(response.body).toHaveProperty('uuid');
      expect(response.body).toHaveProperty('salt');
      registrationUuid = response.body.uuid;
      salt = response.body.salt;
    });

    it('POST /auth/complete-login должен завершить вход в систему', async () => {
      // Генерируем хеш ключ (в реальности это делает клиент)
      const hashKey = 'hashed_password_example';

      const response = await request(app.getHttpServer())
        .post('/auth/complete-login')
        .send({
          uuid: registrationUuid,
          email: testUser.email,
          hash_key: hashKey,
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });
  });

  /**
   * Тест обновления токена
   */
  describe('Обновление токена', () => {
    it('POST /auth/refresh-token должен обновить токены', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({
          refresh_token: refreshToken,
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');

      accessToken = response.body.access_token;
      refreshToken = response.body.refresh_token;
    });
  });

  /**
   * Тест выхода из системы
   */
  describe('Выход из системы', () => {
    it('POST /auth/logout должен завершить сессию', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          refresh_token: refreshToken,
        })
        .expect(201);
    });
  });
});
