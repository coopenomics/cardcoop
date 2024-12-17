import { Injectable } from '@nestjs/common';
import { IssueCardResponseDTO } from '../dto/issue-card-response.dto';
import { IssueCardInputDTO } from '../dto/issue-card-input.dto';
import { CardInteractor } from 'src/domain/interactors/card.interactor';
import type { SchemaResponseDTO } from '../dto/get-card-schema-response.dto';

@Injectable()
export class CardService {
  constructor(private readonly cardInteractor: CardInteractor) {}
  async getJsonSchema(): Promise<SchemaResponseDTO>{
    return this.cardInteractor.getCardSchema() as SchemaResponseDTO
  }

  async issueCard(dto: IssueCardInputDTO, userId: string): Promise<IssueCardResponseDTO> {
    const savedCard = await this.cardInteractor.issueCard({userId, ...dto});

    return {
      id: savedCard.id,
      username: savedCard.username,
    };
  }
}
