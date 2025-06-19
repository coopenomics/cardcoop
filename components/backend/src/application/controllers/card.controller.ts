import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Delete,
  ForbiddenException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CardService } from '../services/card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IssueCardResponseDTO } from '../dto/issue-card-response.dto';
import { IssueCardInputDTO } from '../dto/issue-card-input.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
   * Получает карту по имени пользователя и имени кооператива
   */
  @UseGuards(JwtAuthGuard)
  @Get('by-coop')
  @Swagger('Получение карты по имени пользователя и имени кооператива')
  @ApiQuery({
    name: 'username',
    description: 'Имя пользователя',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'coopname',
    description: 'Имя кооператива',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Данные карты с зашифрованным ключом',
    type: GetUserCardsResponseDTO,
  })
  async getCardByUserAndCoop(
    @Query('username') username: string,
    @Query('coopname') coopname: string,
    @Request() req,
  ): Promise<GetUserCardsResponseDTO> {
    const user_id = req.user.user_id;
    return this.cardService.getCardByUserAndCoop(username, coopname, user_id);
  }

  /**
   * Получает карту по ID
   */
  @UseGuards(JwtAuthGuard)
  @Get(':card_id')
  @Swagger('Получение карты по ID')
  @ApiParam({
    name: 'card_id',
    description: 'ID карты',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Данные карты',
    type: GetUserCardsResponseDTO,
  })
  async getCardById(
    @Param('card_id') card_id: string,
    @Request() req,
  ): Promise<GetUserCardsResponseDTO> {
    const user_id = req.user.user_id;
    return await this.cardService.getCardById(card_id, user_id);
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
