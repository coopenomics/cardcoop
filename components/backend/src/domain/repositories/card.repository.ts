import type { Card } from '../entities/card.entity';

/**
 * Интерфейс репозитория карт пайщика
 * Определяет методы для работы с картами
 */
export interface CardRepository {
  save(card: Partial<Card>): Promise<Card>;
  findById(id: string): Promise<Card | null>;
  findByUsername(username: string, coopname: string): Promise<Card | null>;
  findByUserId(user_id: string): Promise<Card[]>;
  findByUserIdAndCoopName(
    user_id: string,
    coopname: string,
  ): Promise<Card | null>;
  findByPrivateDataId(private_data_id: string): Promise<Card[]>;
}

export const CARD_REPOSITORY = Symbol('CardRepository');
