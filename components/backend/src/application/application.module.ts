/**
 * Модуль приложения (Application Layer) - обработка внешних запросов.
 *
 * Ответственность:
 * - Обрабатывает HTTP-запросы через контроллеры
 * - Преобразует внешние запросы в вызовы доменных сервисов и интеракторов
 * - Отвечает за аутентификацию и авторизацию
 * - Предоставляет API для внешних клиентов
 *
 * Компоненты:
 * - Controllers: Обрабатывают HTTP-запросы и возвращают ответы
 * - Services: Координируют работу доменных сервисов для реализации API
 * - DTOs: Объекты передачи данных для запросов и ответов
 */
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CardController } from './controllers/card.controller';
import { AccessController } from './controllers/access.controller';
import { AuthService } from './services/auth.service';
import { CardService } from './services/card.service';
import { AccessService } from './services/access.service';
import { DomainModule } from 'src/domain/domain.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './controllers/health.controller';
import { PersonaController } from './controllers/persona.controller';
import { PersonaService } from './services/persona.service';

@Module({
  imports: [DomainModule, AuthModule],
  controllers: [
    AuthController,
    CardController,
    AccessController,
    HealthController,
    PersonaController,
  ],
  providers: [AuthService, CardService, AccessService, PersonaService],
  exports: [AuthModule],
})
export class ApplicationModule {}
