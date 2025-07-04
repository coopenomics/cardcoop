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
import { UuidTokenORM } from '../src/infrastructure/database/entities/uuid-token.entity';

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
  let tokenRepository: Repository<UuidTokenORM>;
  let configService: ConfigService;
  let blockchainService: BlockchainService;

  // Тестовые пользователи
  const owner = {
    id: v4(),
    email: `owner-${v4()}@example.com`,
  };

  const consumer = {
    id: v4(),
    email: `consumer-${v4()}@example.com`,
  };

  const testCoop = {
    name: `coop-${v4()}`,
    public_key: 'EOS8mUftJXepGzdQ2TaCduNuSPAfXJHf22uex4u41ab1EVv9EAhWt',
    announce: 'Test Cooperative',
  };

  // Данные для тестовой карты
  const testCard = {
    username: `user-${v4()}`,
    coopname: testCoop.name,
    encrypted_key: 'encrypted-key-data',
    encrypted_data: 'encrypted-personal-data',
    meta: {
      version: 1,
      card_type: 'standard',
    } as CardMetaDTO,
  };

  let accessToken: string;
  let consumerToken: string;
  let cardId: string;
  let ticket: string;
  let usedTicket: string;
  let coopAccessToken: string;

  // Вспомогательная функция для отладки
  const debugResponse = (response) => {
    if (response.status >= 400) {
      console.log('DEBUG - Request failed with status:', response.status);
      console.log('DEBUG - Response body:', response.body);
    }
  };

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
    tokenRepository = moduleFixture.get<Repository<UuidTokenORM>>(
      getRepositoryToken(UuidTokenORM),
    );
    blockchainService = moduleFixture.get<BlockchainService>(BlockchainService);

    await app.init();

    // Создаем тестовых пользователей
    const ownerUser = userRepository.create({
      id: owner.id,
      email: owner.email,
      salt: 'test-salt-owner',
      hash_key: 'test-hash-owner',
    });

    const consumerUser = userRepository.create({
      id: consumer.id,
      email: consumer.email,
      salt: 'test-salt-consumer',
      hash_key: 'test-hash-consumer',
    });

    await userRepository.save([ownerUser, consumerUser]);

    // Генерируем JWT токены
    accessToken = jwtService.sign(
      { user_id: owner.id, email: owner.email },
      { secret: configService.jwtSecret, expiresIn: '1h' },
    );

    consumerToken = jwtService.sign(
      { user_id: consumer.id, email: consumer.email },
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

    // Выпускаем тестовую карту для владельца (owner)
    const cardResponse = await request(app.getHttpServer())
      .post('/card/issue')
      .set('Authorization', `Bearer ${accessToken}`) // Используем токен owner
      .send(testCard)
      .expect(201);

    cardId = cardResponse.body.id;
  });

  afterAll(async () => {
    // Очистка тестовых данных
    await accessRequestRepository.delete({ username: testCard.username });
    await cardRepository.delete({ user_id: owner.id });
    await privateDataRepository.delete({ user_id: owner.id });
    await userRepository.delete({ id: owner.id });
    await userRepository.delete({ id: consumer.id });
    await tokenRepository.delete({});

    // Корректно закрываем приложение и ждем завершения всех соединений
    await app.close();

    // Даем время на закрытие всех соединений
    await new Promise((resolve) => setTimeout(resolve, 500));
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
          version: 1,
          issued_at: new Date(),
          requested_at: new Date(),
          device_id: 'test-device',
          device_type: 'test',
          operating_system: 'test-os',
          browser: 'test-browser',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/access/share-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shareData);

      debugResponse(response);

      expect(response.status).toBe(201);

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

      // Создадим еще один тикет для теста с уже использованным тикетом
      const shareDataForUsedTicket = {
        ...shareData,
        encrypted_data: 'encrypted-data-for-used-ticket',
      };

      const usedTicketResponse = await request(app.getHttpServer())
        .post('/access/share-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shareDataForUsedTicket);

      expect(usedTicketResponse.status).toBe(201);
      usedTicket = usedTicketResponse.body.ticket;

      // Используем этот тикет один раз
      await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket: usedTicket })
        .expect(201);
    });
  });

  /**
   * Тесты обмена тикета на JWT и получения данных
   */
  describe('Обмен тикета и получение данных', () => {
    it('POST /access/exchange-ticket должен обменять тикет на токен доступа', async () => {
      const response = await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket });

      debugResponse(response);

      expect(response.status).toBe(201);

      expect(response.body).toHaveProperty('access_token');
      coopAccessToken = response.body.access_token;

      // Проверяем работу токена с временным запросом
      await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', `Bearer ${coopAccessToken}`)
        .expect(200);

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
      // Убедимся что у нас есть рабочий токен доступа
      expect(coopAccessToken).toBeDefined();

      const response = await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', `Bearer ${coopAccessToken}`);

      expect(response.status).toBe(200);
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
      const response = await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket: 'invalid-ticket' });

      debugResponse(response);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid ticket');
    });

    it('POST /access/exchange-ticket с уже использованным тикетом должен вернуть ошибку', async () => {
      // Сначала используем тикет и получаем данные
      const uniqueTicket = ticket; // Сохраняем оригинальный тикет

      // Теперь пробуем использовать тот же тикет второй раз
      const response = await request(app.getHttpServer())
        .post('/access/exchange-ticket')
        .send({ ticket: uniqueTicket });

      debugResponse(response);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Ticket already used');
    });

    it('GET /access/get-encrypted-data/:username/:coopname с неправильным coopname должен вернуть ошибку', async () => {
      await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/wrong-coop-name`)
        .set('Authorization', `Bearer ${coopAccessToken}`)
        .expect(400);
    });

    it('GET /access/get-encrypted-data/:username/:coopname с чужим JWT токеном должен вернуть ошибку', async () => {
      // Используем JWT токен обычного пользователя (не кооператив)
      await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', `Bearer ${accessToken}`) // Токен обычного пользователя
        .expect(401);
    });

    it('GET /access/get-encrypted-data/:username/:coopname с токеном другого кооператива должен вернуть ошибку', async () => {
      // Создаем токен для другого кооператива
      const otherCoopToken = jwtService.sign(
        { coopname: 'other-coop' },
        { secret: configService.jwtSecret, expiresIn: '1h' },
      );

      await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', `Bearer ${otherCoopToken}`)
        .expect(400);
    });
  });

  /**
   * Тесты на отзыв доступа
   */
  describe('Отзыв доступа', () => {
    it('POST /access/revoke должен отозвать доступ у кооператива', async () => {
      const response = await request(app.getHttpServer())
        .post('/access/revoke')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          username: testCard.username,
          coopname: testCoop.name,
        });

      expect(response.status).toBe(201);

      // После отзыва доступа, кооператив не должен получить данные
      await request(app.getHttpServer())
        .get(`/access/get-encrypted-data/${testCard.username}/${testCoop.name}`)
        .set('Authorization', `Bearer ${coopAccessToken}`)
        .expect(400);
    });

    it('Пользователь сможет снова предоставить доступ после отзыва', async () => {
      // Пытаемся снова предоставить доступ после отзыва
      const shareData = {
        username: testCard.username,
        coopname: testCoop.name,
        encrypted_data: 'new-encrypted-data-after-revoke',
        public_key: testCoop.public_key,
        meta: {
          version: 1,
          issued_at: new Date(),
          requested_at: new Date(),
          device_id: 'test-device',
          device_type: 'test',
          operating_system: 'test-os',
          browser: 'test-browser',
        },
      };

      const response = await request(app.getHttpServer())
        .post('/access/share-data')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shareData)
        .expect(201);

      expect(response.body).toHaveProperty('ticket');
    });
  });

  /**
   * Тесты на защиту от несанкционированного доступа к карте
   */
  describe('Защита от несанкционированного доступа к карте', () => {
    // Создаем вторую тестовую карту для другого пользователя
    let otherCardId: string;

    beforeAll(async () => {
      // Создаем вторую карту для потребителя (consumer)
      const otherCard = {
        ...testCard,
        username: `other-user-${v4()}`,
      };

      const cardResponse = await request(app.getHttpServer())
        .post('/card/issue')
        .set('Authorization', `Bearer ${consumerToken}`) // Используем токен consumer
        .send(otherCard)
        .expect(201);

      otherCardId = cardResponse.body.id;
    });

    it('Пользователь не должен иметь доступа к чужой карте', async () => {
      // Пытаемся получить карту другого пользователя
      await request(app.getHttpServer())
        .get(`/card/${otherCardId}`)
        .set('Authorization', `Bearer ${accessToken}`) // Используем токен owner
        .expect(403); // Либо 403 Forbidden, либо 404 Not Found
    });

    it('POST /access/share-data для чужой карты должен вернуть ошибку', async () => {
      const shareData = {
        username: `other-user-${v4()}`, // Несуществующий или чужой пользователь
        coopname: testCoop.name,
        encrypted_data: 'encrypted-data-for-coop',
        public_key: testCoop.public_key,
        meta: {
          version: 1,
          issued_at: new Date(),
          requested_at: new Date(),
          device_id: 'test-device',
          device_type: 'test',
          operating_system: 'test-os',
          browser: 'test-browser',
        },
      };

      await request(app.getHttpServer())
        .post('/access/share-data')
        .set('Authorization', `Bearer ${accessToken}`) // Используем токен owner
        .send(shareData)
        .expect(400); // Ожидаем Bad Request
    });
  });

  /**
   * Тесты на защиту списка предоставленных доступов
   */
  describe('Защита списка доступов', () => {
    // Если API предоставляет метод для получения списка доступов
    it('GET /access/list должен возвращать список доступов только для своего пользователя', async () => {
      // Проверяем, что пользователь может получить свой список доступов
      const response = await request(app.getHttpServer())
        .get('/access/list')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      // Проверка, что список содержит нужные доступы
      const foundAccess = response.body.some(
        (access) =>
          access.username === testCard.username &&
          access.coopname === testCoop.name,
      );
      expect(foundAccess).toBe(true);
    });

    it('GET /access/list без авторизации должен вернуть ошибку 401', async () => {
      await request(app.getHttpServer()).get('/access/list').expect(401);
    });
  });
});
