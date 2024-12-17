import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { CardService } from '../services/card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IssueCardResponseDTO } from '../dto/issue-card-response.dto';
import { IssueCardInputDTO } from '../dto/issue-card-input.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Swagger } from '../auth/decorators/swagger.decorator';
import { SchemaResponseDTO } from '../dto/get-card-schema-response.dto';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @UseGuards(JwtAuthGuard)
  @Post('issue')
  @Swagger('Выпуск карты')
  @ApiResponse({
    status: 200,
    description: 'Успешный выпуск карты',
    type: IssueCardResponseDTO,
  })
  async issueCard(@Body() dto: IssueCardInputDTO, @Request() req): Promise<IssueCardResponseDTO> {
    const userId = req.user.userId;
    return this.cardService.issueCard(dto, userId);
  }
  
  @Get('schema')
  @ApiResponse({
    status: 200,
    description: 'Получить json-схему карты',
    type: SchemaResponseDTO
  })
  getSchema() {
    return this.cardService.getJsonSchema();
  }
}
