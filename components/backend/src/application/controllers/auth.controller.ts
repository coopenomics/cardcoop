import { Controller, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CompleteLoginResponseDTO } from '../dto/complete-login-response.dto';
import { CompleteLoginInputDTO } from '../dto/complete-login-input.dto';
import { InitiateLoginInputDTO } from '../dto/initiate-login.dto';
import { CompleteRegistrationInputDTO } from '../dto/complete-registration-input.dto';
import { InitiateRegistrationInputDTO } from '../dto/initiate-registration-input.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Swagger } from '../auth/decorators/swagger.decorator';
import { RefreshTokenInputDTO } from '../dto/refresh-token-input.dto';
import { LogoutInputDTO } from '../dto/logout-input.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VerifyEmailInputDTO } from '../dto/verify-email-input.dto';
import { VerifyEmailResponseDTO } from '../dto/verify-email-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate-registration')
  @Swagger('Инициализация регистрации')
  @ApiResponse({
    status: 200,
    description: 'Успешная инициализация регистрации',
    type: InitiateRegistrationInputDTO,
  })
  async initiateRegistration(@Body() dto: InitiateRegistrationInputDTO) {
    return this.authService.initiateRegistration(dto);
  }

  @Post('complete-registration')
  @Swagger('Завершение регистрации')
  @ApiResponse({
    status: 200,
    description: 'Успешное завершение регистрации',
    type: CompleteLoginResponseDTO,
  })
  async completeRegistration(
    @Body() dto: CompleteRegistrationInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    return this.authService.completeRegistration(dto);
  }

  @Post('initiate-login')
  @Swagger('Инициализация входа')
  @ApiResponse({
    status: 200,
    description: 'Успешная инициализация входа',
    type: InitiateLoginInputDTO,
  })
  async initiateLogin(@Body() dto: InitiateLoginInputDTO) {
    return this.authService.initiateLogin(dto);
  }

  @Post('complete-login')
  @Swagger('Завершение входа')
  @ApiResponse({
    status: 200,
    description: 'Успешное завершение входа',
    type: CompleteLoginResponseDTO,
  })
  async completeLogin(
    @Body() dto: CompleteLoginInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    return this.authService.completeLogin(dto);
  }

  @Post('refresh-token')
  @Swagger('Обновление токена')
  @ApiResponse({
    status: 200,
    description: 'Успешное обновление токена',
    type: CompleteLoginResponseDTO,
  })
  async refreshAccessToken(
    @Body() dto: RefreshTokenInputDTO,
  ): Promise<CompleteLoginResponseDTO> {
    return this.authService.refreshAccessToken(dto.refresh_token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @Swagger('Выход')
  @ApiResponse({
    status: 200,
    description: 'Успешный выход',
  })
  async logout(@Body() dto: LogoutInputDTO): Promise<void> {
    await this.authService.logout(dto);
  }

  @Post('verify-email')
  @Swagger('Подтверждение email кодом')
  @ApiResponse({
    status: 201,
    description: 'Email успешно подтвержден',
    type: VerifyEmailResponseDTO,
  })
  async verifyEmail(
    @Body() dto: VerifyEmailInputDTO,
  ): Promise<VerifyEmailResponseDTO> {
    return this.authService.verifyEmail(dto);
  }
}
