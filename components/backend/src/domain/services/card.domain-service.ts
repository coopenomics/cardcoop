/**
 * Доменный сервис для работы с картами пайщиков.
 *
 * Содержит основную бизнес-логику для управления жизненным циклом карт:
 * - Выпуск новых карт
 * - Получение информации о картах
 * - Изменение статуса карт
 * - Управление связью между картами и приватными данными
 *
 * Соблюдает доменные правила и ограничения, такие как уникальность
 * имени пользователя в рамках кооператива и проверки владения картами.
 */
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

@Injectable()
export class CardDomainService {
  constructor(
    @Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository,
    private readonly privateDataService: PrivateDataDomainService,
  ) {}

  /**
   * Выпускает новую карту пайщика.
   *
   * Процесс выпуска включает:
   * 1. Создание или обновление приватных данных пользователя
   * 2. Проверку существования карты с таким же username в кооперативе
   * 3. Создание новой карты или обновление существующей
   * 4. Сохранение карты в репозитории
   *
   * @param data - Данные для выпуска карты
   * @returns Сохраненная карта
   * @throws ForbiddenException - если попытка присвоить карту другого пользователя
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
      data.coopname,
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
      coopname: data.coopname,
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
   * Получает все карты пользователя.
   *
   * Извлекает все карты, принадлежащие указанному пользователю
   * во всех кооперативах.
   *
   * @param user_id - ID пользователя
   * @returns Массив карт пользователя
   */
  async getUserCards(user_id: string): Promise<Card[]> {
    return this.cardRepository.findByUserId(user_id);
  }

  /**
   * Получает карту пользователя в конкретном кооперативе.
   *
   * Каждый пользователь может иметь только одну карту в каждом
   * кооперативе.
   *
   * @param user_id - ID пользователя
   * @param coopname - Название кооператива
   * @returns Карта пользователя или null, если карта не найдена
   */
  async getUserCardInCoop(
    user_id: string,
    coopname: string,
  ): Promise<Card | null> {
    return this.cardRepository.findByUserIdAndCoopName(user_id, coopname);
  }

  /**
   * Находит карту по её ID.
   *
   * Метод для внутреннего использования и проверок перед операциями с картой.
   *
   * @param card_id - ID карты
   * @returns Карта или null, если не найдена
   */
  async findCardById(card_id: string): Promise<Card | null> {
    return this.cardRepository.findById(card_id);
  }

  /**
   * Деактивирует карту пользователя.
   *
   * Изменяет статус карты на неактивный, сохраняя все остальные данные.
   * Проверяет владение картой перед выполнением операции.
   *
   * @param card_id - ID карты для деактивации
   * @param user_id - ID пользователя (для проверки владения)
   * @returns Обновленная карта с измененным статусом
   * @throws NotFoundException - если карта не найдена
   * @throws ForbiddenException - если попытка деактивировать чужую карту
   * @throws Error - если ID карты не предоставлен
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
