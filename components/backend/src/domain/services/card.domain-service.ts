import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CARD_REPOSITORY,
  CardRepository,
} from '../repositories/card.repository';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
import { v4 } from 'uuid';
import { Card } from '../entities/card.entity';
import { PrivateDataDomainService } from './private-data.domain-service';

/**
 * Доменный сервис для работы с картами пайщиков
 */
@Injectable()
export class CardDomainService {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository,
    private readonly privateDataService: PrivateDataDomainService,
  ) {}

  /**
   * Выпускает новую карту пайщика
   *
   * @param data Данные для выпуска карты
   * @returns Сохраненная карта
   */
  async issueCard(data: IssueCardDomainInterface): Promise<Card> {
    // Сохраняем или обновляем приватные данные
    const privateData = await this.privateDataService.createPrivateData(
      data.user_id,
      data.encrypted_data,
      {
        version: data.meta?.version || 1,
        data_type: 'personal',
      },
    );

    // Ищем, есть ли уже карта пользователя с указанным username в кооперативе
    const existingCard = await this.cardRepository.findByUsername(
      data.username,
      data.coop_name,
    );

    // Проверяем, что карта не принадлежит другому пользователю
    if (existingCard && existingCard.user_id !== data.user_id) {
      throw new ForbiddenException('Нельзя присвоить чужую карту!');
    }

    // Создаём карту
    const card = new Card({
      id: existingCard?.id || v4(),
      username: data.username,
      user_id: data.user_id,
      private_data_id: privateData.id,
      coop_name: data.coop_name,
      encrypted_key: data.encrypted_key,
      meta: {
        ...data.meta,
        issued_at: new Date(),
        card_type: data.meta?.card_type || 'standard',
        is_active: true,
      },
    });

    // Сохраняем карту в репозитории
    return this.cardRepository.save(card);
  }

  /**
   * Получает все карты пользователя
   *
   * @param user_id ID пользователя
   * @returns Массив карт пользователя
   */
  async getUserCards(user_id: string): Promise<Card[]> {
    return this.cardRepository.findByUserId(user_id);
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
    return this.cardRepository.findByUserIdAndCoopName(user_id, coop_name);
  }

  /**
   * Деактивирует карту пользователя
   *
   * @param card_id ID карты
   * @param user_id ID пользователя (для проверки владения)
   * @returns Обновленная карта
   */
  async deactivateCard(card_id: string, user_id: string): Promise<Card> {
    // Проверяем, что card_id определен и является валидным UUID
    if (!card_id) {
      throw new Error('Card ID is required');
    }

    const card = await this.cardRepository.findById(card_id);

    if (!card) {
      throw new NotFoundException(`Карта с ID ${card_id} не найдена`);
    }

    if (card.user_id !== user_id) {
      throw new ForbiddenException('Нельзя деактивировать чужую карту');
    }

    // Обновляем метаданные карты
    const updatedCard = new Card({
      ...card,
      meta: {
        ...card.meta,
        is_active: false,
      },
    });

    return this.cardRepository.save(updatedCard);
  }
}
