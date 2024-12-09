import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CardService } from '../application/card.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { IssueCardDto, CardResponseDto } from './dto/card.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Swagger } from './decorators/swagger.decorator';

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
    type: CardResponseDto,
  })
  async issueCard(@Body() dto: IssueCardDto, @Request() req): Promise<CardResponseDto> {
    const userId = req.user.userId;
    return this.cardService.issueCard(dto, userId);
  }
}
