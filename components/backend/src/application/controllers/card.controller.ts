import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { CardService } from '../services/card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IssueCardResponseDTO } from '../dto/issue-card-response.dto';
import { IssueCardInputDTO } from '../dto/issue-card-input.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Swagger } from '../auth/decorators/swagger.decorator';
import { SchemaResponseDTO } from '../dto/get-card-schema-response.dto';
import { GetUserCardsResponseDTO } from '../dto/get-user-cards-response.dto';
import { PrivateDataResponseDTO } from '../dto/private-data-response.dto';

/**
 * Контроллер для управления картами пайщиков
 */
@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  /**
   * Выпускает новую карту пайщика
   */
  @UseGuards(JwtAuthGuard)
  @Post('issue')
  @Swagger('Выпуск карты')
  @ApiResponse({
    status: 200,
    description: 'Успешный выпуск карты',
    type: IssueCardResponseDTO,
  })
  async issueCard(
    @Body() dto: IssueCardInputDTO,
    @Request() req,
  ): Promise<IssueCardResponseDTO> {
    const user_id = req.user.user_id;
    return this.cardService.issueCard(dto, user_id);
  }

  /**
   * Получает JSON-схему карты
   */
  @Get('schema')
  @Swagger('Извлечение актуальной схемы карты')
  @ApiResponse({
    status: 200,
    description: 'Получить json-схему карты',
    type: SchemaResponseDTO,
  })
  getSchema() {
    return this.cardService.getJsonSchema();
  }

  /**
   * Получает список всех карт пользователя
   */
  @UseGuards(JwtAuthGuard)
  @Get('user')
  @Swagger('Получение всех карт пользователя')
  @ApiResponse({
    status: 200,
    description: 'Список карт пользователя',
    type: [GetUserCardsResponseDTO],
  })
  getUserCards(@Request() req): Promise<GetUserCardsResponseDTO[]> {
    const user_id = req.user.user_id;
    return this.cardService.getUserCards(user_id);
  }

  /**
   * Получает приватные данные по ID карты
   */
  @UseGuards(JwtAuthGuard)
  @Get(':card_id/private-data')
  @Swagger('Получение приватных данных по ID карты')
  @ApiParam({
    name: 'card_id',
    description: 'ID карты',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Приватные данные пользователя',
    type: PrivateDataResponseDTO,
  })
  getPrivateData(
    @Param('card_id') card_id: string,
    @Request() req,
  ): Promise<PrivateDataResponseDTO> {
    const user_id = req.user.user_id;
    return this.cardService.getPrivateDataByCardId(card_id, user_id);
  }

  /**
   * Деактивирует карту пользователя
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':card_id')
  @Swagger('Деактивация карты')
  @ApiParam({
    name: 'card_id',
    description: 'ID карты для деактивации',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Карта успешно деактивирована',
    type: IssueCardResponseDTO,
  })
  deactivateCard(
    @Param('card_id') card_id: string,
    @Request() req,
  ): Promise<IssueCardResponseDTO> {
    const user_id = req.user.user_id;
    return this.cardService.deactivateCard(card_id, user_id);
  }
}
