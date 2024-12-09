import { CardService } from '../application/card.service';
import { IssueCardDto, CardResponseDto } from './dto/card.dto';
export declare class CardController {
    private readonly cardService;
    constructor(cardService: CardService);
    issueCard(dto: IssueCardDto, req: any): Promise<CardResponseDto>;
}
