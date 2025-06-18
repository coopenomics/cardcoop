import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AccessService } from '../services/access.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExchangeTicketResponseDTO } from '../dto/exchange-ticket-response.dto';
import { ExchangeTicketInputDTO } from '../dto/exchange-ticket-input.dto';
import { ShareDataResponseDTO } from '../dto/share-data-response.dto';
import { ShareDataDTO } from '../dto/share-data-input.dto';
import { CoopInfoResponseDTO } from '../dto/coop-info-response.dto';
import { PrepareShareDataInputDTO } from '../dto/prepare-share-data-input.dto';
import { CoopJwtAuthGuard } from '../auth/guards/coop-jwt-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Swagger } from '../auth/decorators/swagger.decorator';
import { EncryptedDataResponseDTO } from '../dto/encrypted-data-response.dto';
import { RevokeAccessInputDTO } from '../dto/revoke-access-input.dto';
import { AccessResponseDTO } from '../dto/access-response.dto';

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
    type: CoopInfoResponseDTO,
  })
  async prepareShareData(
    @Body() data: PrepareShareDataInputDTO,
  ): Promise<CoopInfoResponseDTO> {
    return this.accessService.prepareShareData(data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('share-data')
  @Swagger('Передача данных')
  @ApiResponse({
    status: 200,
    description: 'Успешная передача данных',
    type: ShareDataResponseDTO,
  })
  async shareData(
    @Body() data: ShareDataDTO,
    @Request() req,
  ): Promise<ShareDataResponseDTO> {
    const user_id = req.user.user_id;
    return this.accessService.shareData(user_id, data);
  }

  @Post('exchange-ticket')
  @Swagger('Обмен тикета на JWT')
  @ApiResponse({
    status: 200,
    description: 'Успешный обмен тикета на JWT',
    type: ExchangeTicketResponseDTO,
  })
  async exchangeTicketForJwt(
    @Body() data: ExchangeTicketInputDTO,
  ): Promise<ExchangeTicketResponseDTO> {
    return this.accessService.exchangeTicketForJwt(data);
  }

  @UseGuards(CoopJwtAuthGuard)
  @Get('get-encrypted-data/:username/:coopname')
  @Swagger('Получение зашифрованных данных')
  @ApiResponse({
    status: 200,
    description: 'Успешное получение зашифрованных данных',
    type: EncryptedDataResponseDTO,
  })
  async getEncryptedData(
    @Param('username') username: string,
    @Param('coopname') coopname: string,
    @Request() req,
  ): Promise<EncryptedDataResponseDTO> {
    if (!req.user || !req.user.coopname) {
      throw new UnauthorizedException('Доступ запрещен: неверный токен');
    }

    if (req.user.coopname !== coopname) {
      throw new BadRequestException('Неверное имя кооператива');
    }

    return this.accessService.getEncryptedData({ username, coopname });
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke')
  @Swagger('Отзыв доступа у кооператива')
  @ApiResponse({
    status: 201,
    description: 'Доступ успешно отозван',
  })
  async revokeAccess(
    @Body() data: RevokeAccessInputDTO,
    @Request() req,
  ): Promise<void> {
    const user_id = req.user.user_id;
    await this.accessService.revokeAccess(user_id, data);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @Swagger('Получение списка доступов пользователя')
  @ApiResponse({
    status: 200,
    description: 'Список предоставленных доступов пользователя',
    type: [AccessResponseDTO],
  })
  async listAccesses(@Request() req): Promise<AccessResponseDTO[]> {
    const user_id = req.user.user_id;
    return this.accessService.listAccesses(user_id);
  }
}
