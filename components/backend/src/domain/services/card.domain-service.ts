import { Inject, Injectable } from '@nestjs/common';
import { CARD_REPOSITORY, CardRepository } from '../card.repository';
import { Card } from '../card.entity';

@Injectable()
export class CardDomainService {
  constructor(@Inject(CARD_REPOSITORY) private readonly cardRepository: CardRepository) {}

  async issueCard(card: Card): Promise<Card> {
    return this.cardRepository.save(card);
  }
}
