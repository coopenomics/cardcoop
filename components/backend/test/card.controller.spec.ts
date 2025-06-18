import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserORM } from '../src/infrastructure/database/entities/user.entity';
import { UuidTokenORM } from '../src/infrastructure/database/entities/uuid-token.entity';
import { CardORM } from '../src/infrastructure/database/entities/card.orm-entity';
import { Repository } from 'typeorm';
import { ConfigService } from '../src/infrastructure/config/config.service';
import { v4 } from 'uuid';
import { PrivateDataORM } from '../src/infrastructure/database/entities/private-data.orm-entity';
import { CardMetaDTO } from '../src/application/dto/card-meta.dto';

/**
 * Тесты для контроллера карт
 * Проверяет выпуск карты, получение списка карт,
 * получение приватных данных и деактивацию карты
 */
describe('CardController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: Repository<UserORM>;
  let cardRepository: Repository<CardORM>;
  let privateDataRepository: Repository<PrivateDataORM>;
  let configService: ConfigService;

  const testUser = {
    email: `test-${v4()}@example.com`,
    password: 'password123',
    id: v4(),
  };

  // Данные для тестовой карты
  const testCard = {
    username: `user-${v4()}`,
    coop_name: `coop-${v4()}`,
    encrypted_key: 'encrypted-key-data',
    encrypted_data: 'encrypted-personal-data',
    meta: {
      version: 1,
      card_type: 'standard',
    } as CardMetaDTO,
  };

  let accessToken: string;
  let cardId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    userRepository = moduleFixture.get<Repository<UserORM>>(
      getRepositoryToken(UserORM),
    );
    cardRepository = moduleFixture.get<Repository<CardORM>>(
      getRepositoryToken(CardORM),
    );
    privateDataRepository = moduleFixture.get<Repository<PrivateDataORM>>(
      getRepositoryToken(PrivateDataORM),
    );

    await app.init();

    // Создаем тестового пользователя
    const user = userRepository.create({
      id: testUser.id,
      email: testUser.email,
      salt: 'test-salt',
      hash_key: 'test-hash-key',
    });
    await userRepository.save(user);

    // Генерируем JWT токен для аутентификации
    accessToken = jwtService.sign(
      { user_id: testUser.id, email: testUser.email },
      { secret: configService.jwtSecret, expiresIn: '1h' },
    );
  });

  afterAll(async () => {
    // Очистка тестовых данных
    await cardRepository.delete({ user_id: testUser.id });
    await privateDataRepository.delete({ user_id: testUser.id });
    await userRepository.delete({ id: testUser.id });
    await app.close();
  });

  /**
   * Тест получения схемы карты
   */
  describe('Схема карты', () => {
    it('GET /card/schema должен вернуть JSON-схему карты', async () => {
      const response = await request(app.getHttpServer())
        .get('/card/schema')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('$schema');
    });
  });

  /**
   * Тесты для выпуска и управления картами
   */
  describe('Операции с картами', () => {
    it('POST /card/issue должен выпустить новую карту', async () => {
      const response = await request(app.getHttpServer())
        .post('/card/issue')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testCard)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('coop_name');
      expect(response.body.username).toBe(testCard.username);
      expect(response.body.coop_name).toBe(testCard.coop_name);
      expect(response.body.is_active).toBe(true);

      cardId = response.body.id;

      // Проверяем, что карта создана в БД
      const card = await cardRepository.findOne({
        where: { id: cardId },
      });
      expect(card).toBeDefined();

      if (card) {
        expect(card.username).toBe(testCard.username);

        // Проверяем, что созданы приватные данные
        const privateData = await privateDataRepository.findOne({
          where: { user_id: testUser.id },
        });
        expect(privateData).toBeDefined();

        if (privateData) {
          expect(privateData.encrypted_data).toBe(testCard.encrypted_data);

          // Проверяем связь карты с приватными данными
          expect(card.private_data_id).toBe(privateData.id);
        }
      }
    });

    it('GET /card/user должен вернуть список карт пользователя', async () => {
      const response = await request(app.getHttpServer())
        .get('/card/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      const card = response.body.find((c) => c.id === cardId);
      expect(card).toBeDefined();
      expect(card.username).toBe(testCard.username);
      expect(card.coop_name).toBe(testCard.coop_name);
      expect(card.card_type).toBe(testCard.meta.card_type);
      expect(card.is_active).toBe(true);
    });

    it('GET /card/:card_id/private-data должен вернуть приватные данные', async () => {
      const response = await request(app.getHttpServer())
        .get(`/card/${cardId}/private-data`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('encrypted_data');
      expect(response.body).toHaveProperty('data_hash');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('data_type');
      expect(response.body.encrypted_data).toBe(testCard.encrypted_data);
    });

    it('DELETE /card/:card_id должен деактивировать карту', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/card/${cardId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('is_active');
      expect(response.body.id).toBe(cardId);
      expect(response.body.is_active).toBe(false);

      // Проверяем, что карта деактивирована в БД
      const card = await cardRepository.findOne({
        where: { id: cardId },
      });
      expect(card).toBeDefined();

      if (card) {
        expect(card.meta.is_active).toBe(false);
      }
    });

    it('POST /card/issue с тем же username и coop_name должен обновить существующую карту', async () => {
      // Создаем обновленные данные для карты
      const updatedCard = {
        ...testCard,
        encrypted_key: 'new-encrypted-key',
        encrypted_data: 'new-encrypted-data',
        meta: {
          ...testCard.meta,
          card_type: 'premium',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/card/issue')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedCard)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe(cardId); // ID должен остаться тем же
      expect(response.body.card_type).toBe('premium'); // Тип карты должен обновиться

      // Проверяем, что данные карты обновились в БД
      const card = await cardRepository.findOne({
        where: { id: cardId },
      });
      expect(card).toBeDefined();

      if (card) {
        expect(card.encrypted_key).toBe('new-encrypted-key');

        // Проверяем, что приватные данные также обновились
        const privateData = await privateDataRepository.findOne({
          where: { id: card.private_data_id },
        });
        expect(privateData).toBeDefined();

        if (privateData) {
          expect(privateData.encrypted_data).toBe('new-encrypted-data');
        }
      }
    });
  });

  /**
   * Тесты на проверку безопасности и прав доступа
   */
  describe('Проверки безопасности', () => {
    it('GET /card/user без авторизации должен вернуть ошибку 401', async () => {
      await request(app.getHttpServer()).get('/card/user').expect(401);
    });

    it('GET /card/:card_id/private-data с неправильным ID карты должен вернуть ошибку', async () => {
      await request(app.getHttpServer())
        .get(`/card/invalid-id/private-data`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(500); // или 404, в зависимости от реализации
    });
  });
});
