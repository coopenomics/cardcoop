import { Injectable } from '@nestjs/common';
import { IssueCardResponseDTO } from '../dto/issue-card-response.dto';
import { IssueCardInputDTO } from '../dto/issue-card-input.dto';
import { CardInteractor } from 'src/domain/interactors/card.interactor';
import type { SchemaResponseDTO } from '../dto/get-card-schema-response.dto';
import type { GetUserCardsResponseDTO } from '../dto/get-user-cards-response.dto';
import type { PrivateDataResponseDTO } from '../dto/private-data-response.dto';

/**
 * Сервис приложения для работы с картами пайщиков
 */
@Injectable()
export class CardService {
  constructor(private readonly cardInteractor: CardInteractor) {}

  /**
   * Получает схему данных карты
   *
   * @returns JSON-схема карты
   */
  async getJsonSchema(): Promise<SchemaResponseDTO> {
    return this.cardInteractor.getCardSchema() as SchemaResponseDTO;
  }

  /**
   * Выпускает новую карту пайщика
   *
   * @param dto Данные для выпуска карты
   * @param user_id ID пользователя
   * @returns Информация о выпущенной карте
   */
  async issueCard(
    dto: IssueCardInputDTO,
    user_id: string,
  ): Promise<IssueCardResponseDTO> {
    const savedCard = await this.cardInteractor.issueCard({
      user_id,
      ...dto,
    });

    return {
      id: savedCard.id,
      username: savedCard.username,
      coopname: savedCard.coopname,
      issued_at: savedCard.meta.issued_at,
      card_type: savedCard.meta.card_type,
      is_active: savedCard.meta.is_active,
    };
  }

  /**
   * Получает все карты пользователя
   *
   * @param user_id ID пользователя
   * @returns Массив карт пользователя
   */
  async getUserCards(user_id: string): Promise<GetUserCardsResponseDTO[]> {
    const cardsWithPrivateData =
      await this.cardInteractor.getUserCardsWithPrivateData(user_id);

    return cardsWithPrivateData.map(({ card, privateData }) => ({
      id: card.id,
      username: card.username,
      coopname: card.coopname,
      issued_at: card.meta.issued_at,
      card_type: card.meta.card_type,
      is_active: card.meta.is_active,
      encrypted_key: privateData.encrypted_data,
    }));
  }

  /**
   * Получает карту по имени пользователя и имени кооператива
   *
   * @param username Имя пользователя
   * @param coopname Имя кооператива
   * @param user_id ID пользователя для проверки прав доступа
   * @returns Данные карты с зашифрованным ключом
   */
  async getCardByUserAndCoop(
    username: string,
    coopname: string,
    user_id: string,
  ): Promise<GetUserCardsResponseDTO> {
    // Получаем полную информацию о карте с ключом через интерактор
    const { card, privateData } =
      await this.cardInteractor.getCardWithPrivateData(
        username,
        coopname,
        user_id,
      );

    // Преобразуем в DTO и возвращаем
    return {
      id: card.id,
      username: card.username,
      coopname: card.coopname,
      issued_at: card.meta.issued_at,
      card_type: card.meta.card_type,
      is_active: card.meta.is_active,
      encrypted_key: privateData.encrypted_data,
    };
  }

  /**
   * Получает карту по ID
   *
   * @param card_id ID карты
   * @param user_id ID пользователя для проверки доступа
   * @returns Данные карты
   */
  async getCardById(
    card_id: string,
    user_id: string,
  ): Promise<GetUserCardsResponseDTO> {
    // Получаем полную информацию о карте с ключом через интерактор
    const { card, privateData } =
      await this.cardInteractor.getCardWithPrivateDataById(card_id, user_id);

    // Преобразуем в DTO и возвращаем
    return {
      id: card.id,
      username: card.username,
      coopname: card.coopname,
      issued_at: card.meta.issued_at,
      card_type: card.meta.card_type,
      is_active: card.meta.is_active,
      encrypted_key: privateData.encrypted_data,
    };
  }

  /**
   * Получает приватные данные пользователя по ID карты
   *
   * @param card_id ID карты
   * @param user_id ID пользователя
   * @returns Зашифрованные приватные данные
   */
  async getPrivateDataByCardId(
    card_id: string,
    user_id: string,
  ): Promise<PrivateDataResponseDTO> {
    const privateData = await this.cardInteractor.getPrivateDataByCardId(
      card_id,
      user_id,
    );

    return {
      encrypted_data: privateData.encrypted_data,
      data_hash: privateData.data_hash,
      version: privateData.meta.version,
      data_type: privateData.meta.data_type,
    };
  }

  /**
   * Деактивирует карту пользователя
   *
   * @param card_id ID карты
   * @param user_id ID пользователя
   * @returns Информация об обновленной карте
   */
  async deactivateCard(
    card_id: string,
    user_id: string,
  ): Promise<IssueCardResponseDTO> {
    const card = await this.cardInteractor.deactivateCard(card_id, user_id);

    return {
      id: card.id,
      username: card.username,
      coopname: card.coopname,
      issued_at: card.meta.issued_at,
      card_type: card.meta.card_type,
      is_active: card.meta.is_active,
    };
  }
}
