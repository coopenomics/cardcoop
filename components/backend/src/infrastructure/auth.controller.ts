import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { InitiateRegistrationDto, CompleteRegistrationDto, UserResponseDto, InitiateLoginDto, CompleteLoginDto } from './dto/user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Swagger } from './decorators/swagger.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate-registration')
  @Swagger('Инициализация регистрации')
  @ApiResponse({
    status: 200,
    description: 'Успешная инициализация регистрации',
    type: InitiateRegistrationDto,
  })
  async initiateRegistration(@Body() dto: InitiateRegistrationDto) {
    return this.authService.initiateRegistration(dto);
  }

  @Post('complete-registration')
  @Swagger('Завершение регистрации')
  @ApiResponse({
    status: 200,
    description: 'Успешное завершение регистрации',
    type: UserResponseDto,
  })
  async completeRegistration(@Body() dto: CompleteRegistrationDto): Promise<UserResponseDto> {
    return this.authService.completeRegistration(dto);
  }

  @Post('initiate-login')
  @Swagger('Инициализация входа')
  @ApiResponse({
    status: 200,
    description: 'Успешная инициализация входа',
    type: InitiateLoginDto,
  })
  async initiateLogin(@Body() dto: InitiateLoginDto) {
    return this.authService.initiateLogin(dto);
  }

  @Post('complete-login')
  @Swagger('Завершение входа')
  @ApiResponse({
    status: 200,
    description: 'Успешное завершение входа',
    type: UserResponseDto,
  })
  async completeLogin(@Body() dto: CompleteLoginDto): Promise<UserResponseDto> {
    return this.authService.completeLogin(dto);
  }
  
  @Post('refresh-token')
  @Swagger('Обновление токена')
  @ApiResponse({
    status: 200,
    description: 'Успешное обновление токена',
    type: UserResponseDto,
  })
  async refreshAccessToken(@Headers('Authorization') authHeader: string): Promise<UserResponseDto> {
    const refreshToken = authHeader.split(' ')[1]; // Получаем токен из заголовка
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @Swagger('Выход')
  @ApiResponse({
    status: 200,
    description: 'Успешный выход',
  })
  async logout(@Headers('Authorization') authHeader: string): Promise<void> {
    const refreshToken = authHeader.split(' ')[1];
    await this.authService.logout(refreshToken);
  }
}
