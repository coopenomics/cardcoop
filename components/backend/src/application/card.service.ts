import { Injectable } from '@nestjs/common';
import { CardDomainService } from '../domain/services/card.domain-service';
import { IssueCardDto, CardResponseDto } from '../infrastructure/dto/card.dto';
import { Card } from '../domain/card.entity';

@Injectable()
export class CardService {
  constructor(private readonly cardDomainService: CardDomainService) {}

  async issueCard(dto: IssueCardDto, userId: string): Promise<CardResponseDto> {
    const card = new Card();
    card.username = dto.username;
    card.encryptedData = dto.encryptedData;
    card.coopName = dto.coopName;
    card.signature = dto.signature;
    card.userId = userId;

    const savedCard = await this.cardDomainService.issueCard(card);

    return {
      id: savedCard.id,
      username: savedCard.username,
      coopName: savedCard.coopName,
    };
  }
}
