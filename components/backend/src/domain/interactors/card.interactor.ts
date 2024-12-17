import { Injectable } from '@nestjs/common';
import { CardDomainService } from '../services/card.domain-service';
import type { IssueCardDomainInterface } from '../interfaces/issue-card.interface';
import type { Card } from '../entities/card.entity';
import zodToJsonSchema from 'zod-to-json-schema';
import { cardSchema } from '../schemas/card.schema';

@Injectable()
export class CardInteractor {
  constructor(
    private readonly cardDomainService: CardDomainService,  
  ) {}
  
  async issueCard(data: IssueCardDomainInterface): Promise<Card> {
    return this.cardDomainService.issueCard(data)
  }  
  
  
  getCardSchema() {
    return zodToJsonSchema(cardSchema, { name: 'cardSchema' });
  }
  
}