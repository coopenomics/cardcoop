/**
 * Интерактор доступа - реализует сценарии использования (use cases) для управления доступом к данным.
 *
 * Отвечает за:
 * - Подготовку и передачу зашифрованных данных между пользователями и кооперативами
 * - Обмен одноразовых билетов на JWT-токены доступа
 * - Управление запросами доступа к карточкам пользователей
 * - Отзыв ранее предоставленного доступа
 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ACCESS_REQUEST_REPOSITORY,
  AccessRequestRepository,
} from '../repositories/access-request.repository';
import { v4 as uuidv4, v4 } from 'uuid';
import { AccessDomainService } from '../services/access.domain-service';
import {
  COOP_REPOSITORY,
  CoopRepository,
} from '../repositories/coop.repository';
import type { ExchangeTicketResponseDTO } from 'src/application/dto/exchange-ticket-response.dto';
import type { ExchangeTicketInputDTO } from 'src/application/dto/exchange-ticket-input.dto';
import type { ShareDataResponseDTO } from 'src/application/dto/share-data-response.dto';
import type { ShareDataDTO } from 'src/application/dto/share-data-input.dto';
import type { CoopInfoResponseDTO } from 'src/application/dto/coop-info-response.dto';
import * as jwt from 'jsonwebtoken';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../repositories/user.repository';
import {
  CARD_REPOSITORY,
  CardRepository,
} from '../repositories/card.repository';
import { BlockchainService } from 'src/infrastructure/blockchain/blockchain.service';
import type { PrepareShareDataDomainResultInterface } from '../interfaces/prepare-share-data-domain-result.interface';
import { RegistratorContract } from 'cooptypes';
import type { GiveAccessEncryptedDataReponseDomainInterface } from '../interfaces/give-access-encrypted-data-response.dto';
import { AccessRequest } from '../entities/access-request.entity';
import { ConfigService } from 'src/infrastructure/config/config.service';

@Injectable()
export class AccessInteractor {
  constructor(
    private readonly config: ConfigService,
    private readonly accessDomainService: AccessDomainService,
    private readonly blockchainService: BlockchainService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository,
    @Inject(ACCESS_REQUEST_REPOSITORY)
    private readonly accessRepository: AccessRequestRepository,
  ) {}

  /**
   * Подготавливает данные для передачи кооперативу.
   *
   * Получает публичный ключ и анонс кооператива из блокчейна,
   * которые необходимы для шифрования данных перед их передачей.
   *
   * @param coopname - Имя кооператива
   * @returns Объект с данными для шифрования (имя, публичный ключ, анонс)
   * @throws BadRequestException - если публичная информация о кооперативе не найдена
   */
  async prepareShareData(
    coopname: string,
  ): Promise<PrepareShareDataDomainResultInterface> {
    const public_key =
      await this.blockchainService.getAccountPublicKey(coopname);
    const publicData =
      await this.blockchainService.getSingleRow<RegistratorContract.Tables.Cooperatives.ICooperative>(
        RegistratorContract.contractName.production,
        RegistratorContract.contractName.production,
        RegistratorContract.Tables.Cooperatives.tableName,
        coopname,
      );

    if (!publicData)
      throw new BadRequestException(
        'Публичная информация о кооперативе не найдена',
      );

    return {
      coopname,
      public_key,
      announce: publicData.announce,
    };
  }

  /**
   * Передает зашифрованные данные пользователя кооперативу.
   *
   * Создает запись запроса доступа с зашифрованными данными и
   * возвращает одноразовый билет для последующего обмена на JWT.
   *
   * @param user_id - ID пользователя, предоставляющего доступ
   * @param dto - DTO с зашифрованными данными и метаинформацией
   * @returns Одноразовый билет (ticket) для обмена на JWT токен
   * @throws BadRequestException - если карта не найдена или не принадлежит пользователю
   */
  async shareData(user_id: string, dto: ShareDataDTO): Promise<string> {
    const card = await this.cardRepository.findByUsername(
      dto.username,
      dto.coopname,
    );

    if (!card) throw new BadRequestException('Карта не найдена');

    if (user_id != card.user_id)
      throw new BadRequestException('Нельзя воспользоваться чужой картой');

    const accessRequest = new AccessRequest({
      id: v4(),
      username: card.username,
      coopname: dto.coopname,
      encrypted_data: dto.encrypted_data,
      meta: {
        issued_at: new Date(card.meta.issued_at),
        version: card.meta.version,
        requested_at: new Date(),
        ...dto.meta,
      },
      ticket: v4(),
      public_key: dto.public_key,
      ticket_is_used: false,
    });

    const ticket =
      await this.accessDomainService.saveEncryptedCard(accessRequest);

    return ticket;
  }

  /**
   * Обменивает одноразовый билет на JWT токен.
   *
   * Проверяет действительность билета и создает JWT токен для кооператива,
   * предоставляющий ограниченный доступ к данным конкретного пользователя.
   *
   * @param dto - DTO с билетом для обмена
   * @returns Объект, содержащий JWT токен доступа
   * @throws BadRequestException - если билет недействителен или уже использован
   */
  async exchangeTicketForJwt(
    dto: ExchangeTicketInputDTO,
  ): Promise<{ access_token: string }> {
    const accessRequest =
      await this.accessDomainService.getAccessRequestByTicket(dto.ticket);

    if (!accessRequest) {
      throw new BadRequestException('Invalid ticket');
    }

    if (accessRequest.ticket_is_used) {
      throw new BadRequestException('Ticket already used');
    }

    // Генерируем JWT для кооператива с ограниченным доступом
    const coopAccessToken = jwt.sign(
      { username: accessRequest.username, coopname: accessRequest.coopname },
      this.config.jwtSecret,
      { expiresIn: '15m' },
    );

    accessRequest.ticket_is_used = true;

    await this.accessRepository.save(accessRequest);

    return { access_token: coopAccessToken };
  }

  /**
   * Получает зашифрованные данные пользователя для кооператива.
   *
   * Используется кооперативом после аутентификации с JWT токеном
   * для получения фактических зашифрованных данных пользователя.
   *
   * @param username - Имя пользователя карты
   * @param coopname - Имя кооператива
   * @returns Объект с зашифрованными данными и метаинформацией
   */
  async getEncryptedData(
    username: string,
    coopname: string,
  ): Promise<GiveAccessEncryptedDataReponseDomainInterface> {
    const accessRequest =
      await this.accessDomainService.getAccessRequestByUsernameAndCoopname(
        username,
        coopname,
      );

    return {
      coopname,
      username,
      encrypted_data: accessRequest.encrypted_data,
      meta: accessRequest.meta,
      public_key: accessRequest.public_key,
    };
  }

  /**
   * Отзыв доступа к данным карты у кооператива.
   *
   * Удаляет запись доступа, что предотвращает дальнейшую возможность
   * кооператива получать данные пользователя.
   *
   * @param user_id - ID пользователя, отзывающего доступ
   * @param username - Имя пользователя карты
   * @param coopname - Имя кооператива
   * @throws BadRequestException - если карта не найдена или не принадлежит пользователю
   */
  async revokeAccess(
    user_id: string,
    username: string,
    coopname: string,
  ): Promise<void> {
    // Проверка существования карты пользователя
    const card = await this.cardRepository.findByUsername(username, coopname);
    if (!card) {
      throw new BadRequestException('Карта не найдена');
    }

    // Проверка принадлежности карты пользователю
    if (card.user_id !== user_id) {
      throw new BadRequestException('Нет доступа к данной карте');
    }

    // Отзыв доступа
    await this.accessDomainService.revokeAccess(username, coopname);
  }

  /**
   * Получение карт пользователя.
   *
   * Возвращает все карты, принадлежащие указанному пользователю.
   *
   * @param user_id - ID пользователя
   * @returns Массив карт пользователя
   */
  async getUserCards(user_id: string) {
    return this.cardRepository.findByUserId(user_id);
  }

  /**
   * Получение списка доступов по имени пользователя.
   *
   * Возвращает все активные запросы доступа к данным указанного пользователя.
   *
   * @param username - Имя пользователя
   * @returns Список объектов AccessRequest
   */
  async listAccessesByUsername(username: string): Promise<AccessRequest[]> {
    return this.accessDomainService.listAccesses(username);
  }

  /**
   * Получение всех доступов пользователя по всем его картам.
   *
   * Этот метод агрегирует доступы со всех карт пользователя.
   *
   * @param user_id - ID пользователя
   * @returns Список объектов AccessRequest со всех карт пользователя
   */
  async listUserAccesses(user_id: string): Promise<AccessRequest[]> {
    // Получаем все карты пользователя
    const userCards = await this.getUserCards(user_id);

    if (!userCards || userCards.length === 0) {
      return [];
    }

    // Для каждой карты получаем список доступов и объединяем их
    const accessesByCard = await Promise.all(
      userCards.map((card) => this.listAccessesByUsername(card.username)),
    );

    // Преобразуем в плоский массив и возвращаем
    return accessesByCard.flat();
  }
}
