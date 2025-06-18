/**
 * Гвард JWT аутентификации для защиты эндпоинтов.
 *
 * Используется как декоратор контроллеров или методов для ограничения доступа
 * только авторизованным пользователям с действительным JWT токеном.
 *
 * Пример использования:
 * ```
 * @UseGuards(JwtAuthGuard)
 * @Get('protected-endpoint')
 * getProtectedData() {
 *   // Доступно только с действительным JWT
 * }
 * ```
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
