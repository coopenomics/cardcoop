import { CardDomainService } from '../domain/services/card.domain-service';
import { IssueCardDto, CardResponseDto } from '../infrastructure/dto/card.dto';
export declare class CardService {
    private readonly cardDomainService;
    constructor(cardDomainService: CardDomainService);
    issueCard(dto: IssueCardDto, userId: string): Promise<CardResponseDto>;
}
