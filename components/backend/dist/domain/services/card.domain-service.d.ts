import { CardRepository } from '../card.repository';
import { Card } from '../card.entity';
export declare class CardDomainService {
    private readonly cardRepository;
    constructor(cardRepository: CardRepository);
    issueCard(card: Card): Promise<Card>;
}
