import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PersonaService } from '../services/persona.service';
import { PrivateDataResponseDTO } from '../dto/private-data-response.dto';
import { ApiOperation } from '@nestjs/swagger';

/**
 * Контроллер для работы с персональными данными пользователя
 */
@ApiTags('persona')
@Controller('persona')
export class PersonaController {
  constructor(private readonly personaService: PersonaService) {}

  /**
   * Получает приватные данные пользователя
   */
  @UseGuards(JwtAuthGuard)
  @Get('private-data')
  @ApiOperation({ summary: 'Получение приватных данных пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Приватные данные пользователя',
    type: PrivateDataResponseDTO,
  })
  getPrivateData(@Request() req): Promise<PrivateDataResponseDTO> {
    const user_id = req.user.user_id;
    return this.personaService.getUserPrivateData(user_id);
  }
}
