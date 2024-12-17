import { Card } from '../entities/card.entity';

export interface CardRepository {
  save(card: Partial<Card>): Promise<Card>;
  findByUsername(username: string): Promise<Card | null>;
  findByUsernameAndUserId(username: string, userId: string): Promise<Card | null>;
}

export const CARD_REPOSITORY = Symbol('CardRepository')