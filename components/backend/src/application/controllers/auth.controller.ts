/**
 * Контроллер аутентификации и управления пользователями.
 *
 * Обрабатывает все запросы, связанные с процессами:
 * - Регистрации новых пользователей
 * - Аутентификации существующих пользователей
 * - Управления сессиями (токены, выход)
 * - Верификации email
 */
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

  /**
   * Инициализация процесса регистрации.
   *
   * Первый шаг в двухэтапном процессе регистрации:
   * 1. Пользователь отправляет идентификационные данные
   * 2. Система создает временную запись и возвращает данные для следующего шага
   */
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

  /**
   * Завершение процесса регистрации.
   *
   * Второй шаг в двухэтапном процессе регистрации:
   * 1. Пользователь отправляет необходимые данные для завершения регистрации
   * 2. Система создает полноценную учетную запись и возвращает токены доступа
   */
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

  /**
   * Инициализация процесса входа.
   *
   * Первый шаг в двухэтапном процессе входа:
   * 1. Пользователь отправляет идентификационные данные
   * 2. Система проверяет существование пользователя и готовит данные для аутентификации
   */
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

  /**
   * Завершение процесса входа.
   *
   * Второй шаг в двухэтапном процессе входа:
   * 1. Пользователь подтверждает свою личность
   * 2. Система генерирует токены доступа для авторизованных запросов
   */
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

  /**
   * Обновление токена доступа.
   *
   * Позволяет пользователю получить новый access_token без повторной аутентификации,
   * используя действующий refresh_token.
   */
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

  /**
   * Выход из системы.
   *
   * Инвалидирует текущую сессию пользователя:
   * 1. Требует действующий JWT токен
   * 2. Деактивирует связанные с сессией токены refresh_token
   */
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

  /**
   * Верификация email.
   *
   * Подтверждает принадлежность email адреса пользователю:
   * 1. Пользователь отправляет код подтверждения, полученный по email
   * 2. Система верифицирует email при корректном коде
   */
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
