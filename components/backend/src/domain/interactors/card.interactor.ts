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
}
