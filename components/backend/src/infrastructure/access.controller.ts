import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { AccessService } from '../application/access.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { PrepareShareDataDto, CoopInfoResponseDto, ShareDataDto, ShareDataResponseDto, CoopExchangeTicketDto, CoopJwtResponseDto } from './dto/access.dto';
import { CoopJwtAuthGuard } from './guards/coop-jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Swagger } from './decorators/swagger.decorator';

@ApiTags('Access')
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @UseGuards(JwtAuthGuard)
  @Post('prepare-share-data')
  @Swagger('Подготовка данных для общего доступа')
  @ApiResponse({
    status: 200,
    description: 'Успешная подготовка данных',
    type: CoopInfoResponseDto,
  })
  async prepareShareData(@Body() dto: PrepareShareDataDto): Promise<CoopInfoResponseDto> {
    return this.accessService.prepareShareData(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('share-data')
  @Swagger('Передача данных')
  @ApiResponse({
    status: 200,
    description: 'Успешная передача данных',
    type: ShareDataResponseDto,
  })
  async shareData(@Body() dto: ShareDataDto, @Request() req): Promise<ShareDataResponseDto> {
    const username = req.user.userId;
    return this.accessService.shareData(dto, username);
  }

  @Post('exchange-ticket')
  @Swagger('Обмен тикета на JWT')
  @ApiResponse({
    status: 200,
    description: 'Успешный обмен тикета на JWT',
    type: CoopJwtResponseDto,
  })
  async exchangeTicketForJwt(@Body() dto: CoopExchangeTicketDto): Promise<CoopJwtResponseDto> {
    return this.accessService.exchangeTicketForJwt(dto);
  }

  @UseGuards(CoopJwtAuthGuard)
  @Get('get-encrypted-data/:username/:coopName')
  @Swagger('Получение зашифрованных данных')
  @ApiResponse({
    status: 200,
    description: 'Успешное получение зашифрованных данных',
    schema: {
      type: 'object',
      properties: {
        encryptedData: { type: 'string' },
      },
    },
  })
  async getEncryptedData(@Param('username') username: string, @Param('coopName') coopName: string): Promise<{ encryptedData: string }> {
    const encryptedData = await this.accessService.getEncryptedData(username, coopName);
    return { encryptedData };
  }

  // Методы для revokeAccess и listAccesses остаются без изменений
}
