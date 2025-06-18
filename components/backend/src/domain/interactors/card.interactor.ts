import { Injectable } from '@nestjs/common';
import { CardDomainService } from '../services/card.domain-service';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
import zodToJsonSchema from 'zod-to-json-schema';
import { cardSchema } from '../schemas/card.schema';
import type { Card } from '../entities/card.entity';
import { PrivateDataDomainService } from '../services/private-data.domain-service';

/**
 * Интерактор для работы с картами пайщиков
 * Предоставляет функции для выпуска карт, получения данных карты и т.д.
 */
@Injectable()
export class CardInteractor {
  constructor(
    private readonly cardDomainService: CardDomainService,
    private readonly privateDataService: PrivateDataDomainService,
  ) {}

  /**
   * Выпускает новую карту пайщика
   *
   * @param data Данные для выпуска карты
   * @returns Созданная карта
   */
  async issueCard(data: IssueCardDomainInterface): Promise<Card> {
    return this.cardDomainService.issueCard(data);
  }

  /**
   * Получает все карты пользователя
   *
   * @param user_id ID пользователя
   * @returns Массив карт пользователя
   */
  async getUserCards(user_id: string): Promise<Card[]> {
    return this.cardDomainService.getUserCards(user_id);
  }

  /**
   * Получает карту пользователя в конкретном кооперативе
   *
   * @param user_id ID пользователя
   * @param coop_name Название кооператива
   * @returns Карта пользователя или null
   */
  async getUserCardInCoop(
    user_id: string,
    coop_name: string,
  ): Promise<Card | null> {
    return this.cardDomainService.getUserCardInCoop(user_id, coop_name);
  }

  /**
   * Получает приватные данные по ID карты
   *
   * @param card_id ID карты
   * @param user_id ID пользователя (для проверки прав)
   * @returns Объект приватных данных или null
   */
  async getPrivateDataByCardId(card_id: string, user_id: string): Promise<any> {
    // Находим карту
    const cards = await this.cardDomainService.getUserCards(user_id);
    const card = cards.find((c) => c.id === card_id);

    // Проверяем, что карта принадлежит пользователю
    if (!card) {
      throw new Error('Карта не найдена или не принадлежит пользователю');
    }

    // Получаем приватные данные по ID
    return this.privateDataService.getPrivateDataById(card.private_data_id);
  }

  /**
   * Деактивирует карту пользователя
   *
   * @param card_id ID карты
   * @param user_id ID пользователя
   * @returns Обновленная карта
   */
  async deactivateCard(card_id: string, user_id: string): Promise<Card> {
    return this.cardDomainService.deactivateCard(card_id, user_id);
  }

  /**
   * Получает JSON-схему карты
   *
   * @returns JSON-схема карты
   */
  getCardSchema() {
    return zodToJsonSchema(cardSchema, { name: 'cardSchema' });
  }
}
