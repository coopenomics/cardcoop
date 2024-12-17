import { CardRepository } from '../repositories/card.repository';
import { Card } from '../entities/card.entity';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
export declare class CardDomainService {
    private readonly cardRepository;
    constructor(cardRepository: CardRepository);
    issueCard(data: IssueCardDomainInterface): Promise<Card>;
}
