import { Controller, Get } from '@nestjs/common';

/**
 * Контроллер для проверки работоспособности приложения
 */
@Controller()
export class HealthController {
  /**
   * Проверка работоспособности приложения
   * @returns Статус приложения
   */
  @Get()
  healthCheck() {
    return { status: 'ok' };
  }
}
