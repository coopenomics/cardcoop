/**
 * Стратегия JWT аутентификации для пользователей кооператива.
 *
 * Специальная версия JWT стратегии для пользователей с расширенными правами,
 * связанных с кооперативом. Извлекает информацию о пользователе и его кооперативе
 * из JWT токена для дальнейшей авторизации.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from 'src/infrastructure/config/config.service';

@Injectable()
export class CoopJwtStrategy extends PassportStrategy(Strategy, 'coop-jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    });
  }

  /**
   * Валидирует JWT токен кооператива.
   *
   * @param payload - Декодированное содержимое JWT
   * @returns Объект с информацией о пользователе и его кооперативе
   */
  async validate(payload: any) {
    return { username: payload.username, coopname: payload.coopname };
  }
}
