/**
 * Корневой модуль приложения.
 *
 * Объединяет основные модули приложения, следуя принципам чистой архитектуры:
 * - DomainModule - бизнес-логика и бизнес-сущности
 * - ApplicationModule - обработчики запросов, адаптеры, контроллеры
 * - InfrastructureModule - внешние сервисы, базы данных, блокчейн
 */
import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [DomainModule, ApplicationModule, InfrastructureModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
