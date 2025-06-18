import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserORM } from '../src/infrastructure/database/entities/user.entity';
import { CardORM } from '../src/infrastructure/database/entities/card.orm-entity';
import { Repository } from 'typeorm';
import { ConfigService } from '../src/infrastructure/config/config.service';
import { v4 } from 'uuid';
import { PrivateDataORM } from '../src/infrastructure/database/entities/private-data.orm-entity';
import { CardMetaDTO } from '../src/application/dto/card-meta.dto';
import { AccessRequestORM } from '../src/infrastructure/database/entities/access-request.orm-entity';
import { BlockchainService } from '../src/infrastructure/blockchain/blockchain.service';

/**
 * Тесты для контроллера доступа
 * Проверяет подготовку к обмену данными, обмен данными и получение данных кооперативом
 */
describe('AccessController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let userRepository: Repository<UserORM>;
  let cardRepository: Repository<CardORM>;
  let privateDataRepository: Repository<PrivateDataORM>;
  let accessRequestRepository: Repository<AccessRequestORM>;
  let configService: ConfigService;
  let blockchainService: BlockchainService;

  const testUser = {
    email: `test-${v4()}@example.com`,
    password: 'password123',
    id: v4(),
  };

  const testCoop = {
    name: `coop-${v4()}`,
    public_key: 'EOS8mUftJXepGzdQ2TaCduNuSPAfXJHf22uex4u41ab1EVv9EAhWt',
    announce: 'Test Cooperative',
  };

  // Данные для тестовой карты
  const testCard = {
    username: `user-${v4()}`,
    coop_name: testCoop.name,
    encrypted_key: 'encrypted-key-data',
    encrypted_data: 'encrypted-personal-data',
    meta: {
      version: 1,
      card_type: 'standard',
    } as CardMetaDTO,
  };

  let accessToken: string;
  let cardId: string;
  let ticket: string;
  let coopAccessToken: string;

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
    accessRequestRepository = moduleFixture.get<Repository<AccessRequestORM>>(
      getRepositoryToken(AccessRequestORM),
    );
    blockchainService = moduleFixture.get<BlockchainService>(BlockchainService);

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

    // Заглушка для BlockchainService
    jest
      .spyOn(blockchainService, 'getAccountPublicKey')
      .mockImplementation(async (name: string) =>
        Promise.resolve(testCoop.public_key),
      );
    jest.spyOn(blockchainService, 'getSingleRow').mockImplementation(async () =>
      Promise.resolve({
        announce: testCoop.announce,
      }),
    );

    // Выпускаем тестовую карту
    const cardResponse = await request(app.getHttpServer())
      .post('/card/issue')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testCard)
      .expect(201);

    cardId = cardResponse.body.id;
  });

  afterAll(async () => {
    // Очистка тестовых данных
    await accessRequestRepository.delete({ username: testCard.username });
    await cardRepository.delete({ user_id: testUser.id });
    await privateDataRepository.delete({ user_id: testUser.id });
    await userRepository.delete({ id: testUser.id });
    await app.close();
  });

  /**
   * Тесты процесса предоставления доступа
   */
  describe('Предоставление доступа', () => {
    it('POST /access/prepare-share-data должен подготовить данные для обмена', async () => {
      const response = await request(app.getHttpServer())
        .post('/access/prepare-share-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ coopname: testCoop.name })
        .expect(201);

      expect(response.body).toHaveProperty('coopname');
      expect(response.body).toHaveProperty('public_key');
      expect(response.body).toHaveProperty('announce');
      expect(response.body.coopname).toBe(testCoop.name);
      expect(response.body.public_key).toBe(testCoop.public_key);
      expect(response.body.announce).toBe(testCoop.announce);
    });

    it('POST /access/share-data должен создать запрос на доступ', async () => {
      const shareData = {
        username: testCard.username,
        coopname: testCoop.name,
        encrypted_data: 'encrypted-data-for-coop',
        public_key: testCoop.public_key,
        meta: {
          additional: 'info',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/access/share-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shareData)
        .expect(201);

      expect(response.body).toHaveProperty('ticket');
      ticket = response.body.ticket;

      // Проверяем, что запрос на доступ создан в БД
      const accessRequest = await accessRequestRepository.findOne({
        where: { ticket },
      });
      expect(accessRequest).toBeDefined();
      if (accessRequest) {
        expect(accessRequest.username).toBe(shareData.username);
        expect(accessRequest.coopname).toBe(shareData.coopname);
        expect(accessRequest.encrypted_data).toBe(shareData.encrypted_data);
        expect(accessRequest.ticket_is_used).toBe(false);
      }
    });
  });

  /**
   * Тесты обмена тикета на JWT и получения данных
   */
  describe('Обмен тикета и получение данных', () => {
    it('POST /access/exchange-ticket должен обменять тикет на токен доступа', async () => {
      const response = await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      coopAccessToken = response.body.access_token;

      // Проверяем, что тикет помечен как использованный
      const accessRequest = await accessRequestRepository.findOne({
        where: { ticket },
      });
      expect(accessRequest).toBeDefined();
      if (accessRequest) {
        expect(accessRequest.ticket_is_used).toBe(true);
      }
    });

    it('GET /access/get-encrypted-data/:username/:coopname должен вернуть зашифрованные данные', async () => {
      const response = await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', `Bearer ${coopAccessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('coopname');
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('encrypted_data');
      expect(response.body).toHaveProperty('meta');
      expect(response.body).toHaveProperty('public_key');

      expect(response.body.coopname).toBe(testCoop.name);
      expect(response.body.username).toBe(testCard.username);
      expect(response.body.public_key).toBe(testCoop.public_key);
    });
  });

  /**
   * Тесты на проверку безопасности и ошибки
   */
  describe('Проверки безопасности', () => {
    it('POST /access/prepare-share-data без авторизации должен вернуть ошибку 401', async () => {
      await request(app.getHttpServer())
        .post('/access/prepare-share-data')
        .send({ coopname: testCoop.name })
        .expect(401);
    });

    it('GET /access/get-encrypted-data/:username/:coopname с неверным токеном должен вернуть ошибку 401', async () => {
      await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('POST /access/exchange-ticket с неверным тикетом должен вернуть ошибку', async () => {
      await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket: 'invalid-ticket' })
        .expect(400);
    });

    it('POST /access/exchange-ticket с уже использованным тикетом должен вернуть ошибку', async () => {
      await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket })
        .expect(400);
    });
  });
});
