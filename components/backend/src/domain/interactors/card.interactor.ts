/**
 * Интерактор для работы с картами пайщиков.
 *
 * Реализует сценарии использования (use cases) для управления картами пользователей
 * в кооперативах. Отвечает за координацию бизнес-логики, связанной с картами,
 * включая выпуск новых карт, получение информации о картах и управление их статусом.
 */
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CardDomainService } from '../services/card.domain-service';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
import zodToJsonSchema from 'zod-to-json-schema';
import { cardSchema } from '../schemas/card.schema';
import type { Card } from '../entities/card.entity';
import { PrivateDataDomainService } from '../services/private-data.domain-service';

@Injectable()
export class CardInteractor {
  constructor(
    private readonly cardDomainService: CardDomainService,
    private readonly privateDataService: PrivateDataDomainService,
  ) {}

  /**
   * Выпускает новую карту пайщика.
   *
   * Создает новую карту в системе и связывает ее с соответствующим пользователем
   * и кооперативом. Карта содержит как публичную информацию, так и ссылку на
   * приватные данные пользователя.
   *
   * @param data - Данные для выпуска карты
   * @returns Созданная карта
   */
  async issueCard(data: IssueCardDomainInterface): Promise<Card> {
    return this.cardDomainService.issueCard(data);
  }

  /**
   * Получает все карты пользователя.
   *
   * Возвращает список всех карт во всех кооперативах,
   * принадлежащих указанному пользователю.
   *
   * @param user_id - ID пользователя
   * @returns Массив карт пользователя
   */
  async getUserCards(user_id: string): Promise<Card[]> {
    return this.cardDomainService.getUserCards(user_id);
  }

  /**
   * Получает карту пользователя в конкретном кооперативе.
   *
   * Находит карту пользователя в указанном кооперативе, если она существует.
   * У одного пользователя может быть только одна карта в каждом кооперативе.
   *
   * @param user_id - ID пользователя
   * @param coopname - Название кооператива
   * @returns Карта пользователя или null, если карта не найдена
   */
  async getUserCardInCoop(
    user_id: string,
    coopname: string,
  ): Promise<Card | null> {
    return this.cardDomainService.getUserCardInCoop(user_id, coopname);
  }

  /**
   * Получает карту по имени пользователя и имени кооператива.
   *
   * Проверяет уникальность карты по комбинации username и coopname.
   * У одного пользователя может быть только одна карта в каждом кооперативе.
   *
   * @param username - Имя пользователя
   * @param coopname - Название кооператива
   * @param requesting_user_id - ID пользователя, запрашивающего карту
   * @returns Карта пользователя
   * @throws NotFoundException - если карта не найдена
   * @throws ForbiddenException - если запрашивающий пользователь не имеет прав на просмотр карты
   */
  async getCardByUserAndCoop(
    username: string,
    coopname: string,
    requesting_user_id: string,
  ): Promise<Card> {
    // Ищем карту по username и coopname
    const card = await this.cardDomainService.findCardByUserAndCoop(
      username,
      coopname,
    );

    if (!card) {
      throw new NotFoundException(
        `Карта для пользователя ${username} в кооперативе ${coopname} не найдена`,
      );
    }

    // Проверяем, что запрашивающий пользователь имеет право на просмотр карты
    if (card.user_id !== requesting_user_id) {
      throw new ForbiddenException(
        'Доступ запрещен: запрашиваемая карта не принадлежит пользователю',
      );
    }

    return card;
  }

  /**
   * Получает карту по ID.
   *
   * Находит карту по её уникальному идентификатору и проверяет,
   * что запрашивающий пользователь является её владельцем.
   *
   * @param card_id - ID карты
   * @param user_id - ID пользователя (для проверки прав)
   * @returns Объект карты
   * @throws NotFoundException - если карта не найдена
   * @throws ForbiddenException - если карта не принадлежит пользователю
   */
  async getCardById(card_id: string, user_id: string): Promise<Card> {
    // Проверяем существование карты
    const card = await this.cardDomainService.findCardById(card_id);

    if (!card) {
      throw new NotFoundException(`Карта с ID ${card_id} не найдена`);
    }

    // Проверяем владение картой
    if (card.user_id !== user_id) {
      throw new ForbiddenException(
        'Доступ запрещен: карта не принадлежит пользователю',
      );
    }

    return card;
  }

  /**
   * Получает приватные данные по ID карты.
   *
   * Извлекает приватные данные, связанные с картой,
   * предварительно проверяя, принадлежит ли карта запрашивающему пользователю.
   *
   * @param card_id - ID карты
   * @param user_id - ID пользователя (для проверки прав)
   * @returns Объект приватных данных
   * @throws ForbiddenException - если карта не принадлежит пользователю
   */
  async getPrivateDataByCardId(card_id: string, user_id: string): Promise<any> {
    // Находим карту
    const cards = await this.cardDomainService.getUserCards(user_id);
    const card = cards.find((c) => c.id === card_id);

    // Проверяем, что карта принадлежит пользователю
    if (!card) {
      throw new ForbiddenException(
        'Доступ запрещен: карта не принадлежит пользователю',
      );
    }

    // Получаем приватные данные по ID
    return this.privateDataService.getPrivateDataById(card.private_data_id);
  }

  /**
   * Деактивирует карту пользователя.
   *
   * Изменяет статус карты на неактивный, что предотвращает
   * её дальнейшее использование в системе.
   *
   * @param card_id - ID карты
   * @param user_id - ID пользователя
   * @returns Обновленная карта с измененным статусом
   * @throws BadRequestException - если карта не найдена или не принадлежит пользователю
   */
  async deactivateCard(card_id: string, user_id: string): Promise<Card> {
    return this.cardDomainService.deactivateCard(card_id, user_id);
  }

  /**
   * Получает JSON-схему карты.
   *
   * Возвращает описание структуры данных карты в формате JSON Schema,
   * которое может использоваться для валидации или документирования.
   *
   * @returns JSON-схема карты
   */
  getCardSchema() {
    return zodToJsonSchema(cardSchema, { name: 'cardSchema' });
  }

  /**
   * Получает карту вместе с приватными данными по имени пользователя и имени кооператива.
   *
   * @param username - Имя пользователя
   * @param coopname - Название кооператива
   * @param requesting_user_id - ID пользователя, запрашивающего карту
   * @returns Объект, содержащий карту и соответствующие приватные данные
   * @throws NotFoundException - если карта не найдена
   * @throws ForbiddenException - если запрашивающий пользователь не имеет прав на просмотр карты
   */
  async getCardWithPrivateData(
    username: string,
    coopname: string,
    requesting_user_id: string,
  ): Promise<{ card: Card; privateData: any }> {
    // Получаем карту по username и coopname
    const card = await this.getCardByUserAndCoop(
      username,
      coopname,
      requesting_user_id,
    );

    if (!card) {
      throw new NotFoundException(
        `Карта для пользователя ${username} в кооперативе ${coopname} не найдена`,
      );
    }

    // Получаем приватные данные
    const privateData = await this.privateDataService.getPrivateDataById(
      card.private_data_id,
    );

    return { card, privateData };
  }

  /**
   * Получает карту вместе с приватными данными по ID карты.
   *
   * @param card_id - ID карты
   * @param requesting_user_id - ID пользователя, запрашивающего карту
   * @returns Объект, содержащий карту и соответствующие приватные данные
   * @throws NotFoundException - если карта не найдена
   * @throws ForbiddenException - если запрашивающий пользователь не имеет прав на просмотр карты
   */
  async getCardWithPrivateDataById(
    card_id: string,
    requesting_user_id: string,
  ): Promise<{ card: Card; privateData: any }> {
    // Получаем карту по ID
    const card = await this.getCardById(card_id, requesting_user_id);

    // Получаем приватные данные
    const privateData = await this.privateDataService.getPrivateDataById(
      card.private_data_id,
    );

    return { card, privateData };
  }

  /**
   * Получает все карты пользователя вместе с их приватными данными.
   *
   * @param user_id - ID пользователя
   * @returns Массив объектов, содержащих карты и соответствующие приватные данные
   */
  async getUserCardsWithPrivateData(
    user_id: string,
  ): Promise<Array<{ card: Card; privateData: any }>> {
    const cards = await this.getUserCards(user_id);
    const result: Array<{ card: Card; privateData: any }> = [];

    // Запрашиваем приватные данные для каждой карты
    for (const card of cards) {
      const privateData = await this.privateDataService.getPrivateDataById(
        card.private_data_id,
      );
      result.push({ card, privateData });
    }

    return result;
  }

  /**
   * Получает приватные данные пользователя без привязки к карте.
   *
   * @param user_id - ID пользователя
   * @returns Объект приватных данных
   * @throws NotFoundException - если приватные данные не найдены
   */
  async getUserPrivateData(user_id: string): Promise<any> {
    // Получаем приватные данные пользователя
    const privateData =
      await this.privateDataService.getPrivateDataByUserId(user_id);

    // Если данные не найдены, выбрасываем исключение
    if (!privateData) {
      throw new NotFoundException(
        `Приватные данные для пользователя ${user_id} не найдены`,
      );
    }

    return privateData;
  }
}
