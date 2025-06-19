import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserRepository } from '../src/domain/repositories/user.repository';
import { Repository } from 'typeorm';
import { UserORM } from 'src/infrastructure/database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardORM } from '../src/infrastructure/database/entities/card.orm-entity';
import { PrivateDataORM } from '../src/infrastructure/database/entities/private-data.orm-entity';
import { v4 as uuid } from 'uuid';
import { sha256 } from '../src/utils/createHash';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../src/infrastructure/config/config.service';

// Функция для отладки ответов
const debugResponse = (response: request.Response) => {
  if (process.env.DEBUG) {
    console.log('Response status:', response.status);
    console.log('Response body:', response.body);
  }
};

describe('PersonaController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<UserORM>;
  let cardRepository: Repository<CardORM>;
  let privateDataRepository: Repository<PrivateDataORM>;
  let jwtService: JwtService;
  let configService: ConfigService;
  let accessToken: string;
  let userId: string;

  // Для проверки безопасности
  let otherUserId: string;
  let otherUserAccessToken: string;

  // Тестовые данные
  const testUser = {
    email: `test.user.${Date.now()}@example.com`,
    hash_key: 'hash123',
    salt: 'salt123',
  };

  // Данные для второго тестового пользователя
  const testOtherUser = {
    email: `other.user.${Date.now()}@example.com`,
    hash_key: 'hash456',
    salt: 'salt456',
  };

  const testPrivateData = {
    encrypted_data: 'test-encrypted-data',
    data_hash: 'test-data-hash',
    meta: {
      version: 1,
      data_type: 'personal',
      created_at: new Date(),
      updated_at: new Date(),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Получаем репозитории и сервисы
    userRepository = moduleFixture.get<Repository<UserORM>>(
      getRepositoryToken(UserORM),
    );
    cardRepository = moduleFixture.get<Repository<CardORM>>(
      getRepositoryToken(CardORM),
    );
    privateDataRepository = moduleFixture.get<Repository<PrivateDataORM>>(
      getRepositoryToken(PrivateDataORM),
    );
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);

    // Создаем тестового пользователя
    userId = uuid();
    const newUser = userRepository.create({
      id: userId,
      email: testUser.email,
      hash_key: testUser.hash_key,
      salt: testUser.salt,
    });

    await userRepository.save(newUser);

    // Создаем тестовые приватные данные
    const newPrivateData = privateDataRepository.create({
      id: uuid(),
      user_id: userId,
      encrypted_data: testPrivateData.encrypted_data,
      data_hash: testPrivateData.data_hash,
      meta: testPrivateData.meta,
    });

    await privateDataRepository.save(newPrivateData);

    // Генерируем JWT токен для аутентификации
    accessToken = jwtService.sign(
      { user_id: userId, email: testUser.email },
      { secret: configService.jwtSecret, expiresIn: '1h' },
    );

    // Создаем второго тестового пользователя для проверки безопасности
    otherUserId = uuid();
    const otherUser = userRepository.create({
      id: otherUserId,
      email: testOtherUser.email,
      hash_key: testOtherUser.hash_key,
      salt: testOtherUser.salt,
    });

    await userRepository.save(otherUser);

    // Создаем токен для второго пользователя
    otherUserAccessToken = jwtService.sign(
      { user_id: otherUserId, email: testOtherUser.email },
      { secret: configService.jwtSecret, expiresIn: '1h' },
    );
  });

  afterAll(async () => {
    // Очистка тестовых данных
    await privateDataRepository.delete({ user_id: userId });
    await userRepository.delete({ id: userId });
    await userRepository.delete({ id: otherUserId });
    await app.close();
  });

  describe('Успешные запросы', () => {
    it('GET /persona/private-data должен вернуть приватные данные пользователя', async () => {
      const response = await request(app.getHttpServer())
        .get('/persona/private-data')
        .set('Authorization', `Bearer ${accessToken}`);

      debugResponse(response);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('encrypted_data');
      expect(response.body).toHaveProperty('data_hash');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('data_type');
      expect(response.body.encrypted_data).toBe(testPrivateData.encrypted_data);
    });
  });

  describe('Проверки безопасности', () => {
    it('GET /persona/private-data без токена должен вернуть ошибку 401', async () => {
      const response = await request(app.getHttpServer()).get(
        '/persona/private-data',
      );

      debugResponse(response);

      expect(response.status).toBe(401);
    });

    it('GET /persona/private-data с токеном другого пользователя должен вернуть только данные этого другого пользователя', async () => {
      const response = await request(app.getHttpServer())
        .get('/persona/private-data')
        .set('Authorization', `Bearer ${otherUserAccessToken}`);

      debugResponse(response);

      // Запрос должен выполниться успешно, но вернуть данные второго пользователя (или ошибку 404, если у него нет данных)
      // В данном случае у нас должна быть ошибка 404, так как для второго пользователя мы не создавали приватные данные
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('не найдены');
    });

    it('GET /persona/private-data с неверным токеном должен вернуть ошибку 401', async () => {
      const invalidToken = 'invalid-token-123';

      const response = await request(app.getHttpServer())
        .get('/persona/private-data')
        .set('Authorization', `Bearer ${invalidToken}`);

      debugResponse(response);

      expect(response.status).toBe(401);
    });
  });
});
