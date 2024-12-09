import { Card } from './card.entity';

export interface CardRepository {
  save(card: Partial<Card>): Promise<Card>;
  findByUsername(username: string): Promise<Card | undefined>;
}

export const CARD_REPOSITORY = Symbol('CardRepository')