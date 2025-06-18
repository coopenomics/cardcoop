/**
 * Стратегия аутентификации с использованием JWT токена.
 *
 * Реализует логику проверки и валидации JWT токенов для обычных пользователей.
 * Извлекает токен из заголовка Authorization и проверяет его подпись.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from 'src/infrastructure/config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  /**
   * Метод валидации токена.
   *
   * Вызывается после проверки подписи JWT.
   * Извлекает идентификатор пользователя и создает объект пользователя,
   * который будет доступен через req.user в контроллерах.
   *
   * @param payload - Декодированное содержимое JWT
   * @returns Объект пользователя для дальнейшего использования
   */
  async validate(payload: any) {
    // В стандартном JWT токене идентификатор находится в поле sub
    const user_id = payload.sub || payload.user_id;
    return { user_id };
  }
}
