import { CardRepository } from '../repositories/card.repository';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
import { Card } from '../entities/card.entity';
import { PrivateDataDomainService } from './private-data.domain-service';
export declare class CardDomainService {
    private readonly cardRepository;
    private readonly privateDataService;
    constructor(cardRepository: CardRepository, privateDataService: PrivateDataDomainService);
    issueCard(data: IssueCardDomainInterface): Promise<Card>;
    getUserCards(user_id: string): Promise<Card[]>;
    getUserCardInCoop(user_id: string, coop_name: string): Promise<Card | null>;
    deactivateCard(card_id: string, user_id: string): Promise<Card>;
}
