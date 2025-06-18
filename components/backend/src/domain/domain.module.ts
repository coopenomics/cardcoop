/**
 * Модуль домена (Domain Layer) - сердце бизнес-логики приложения.
 *
 * Ответственность:
 * - Содержит бизнес-логику и правила
 * - Независим от внешних слоев (инфраструктуры и приложения)
 * - Определяет интерфейсы для взаимодействия с внешними сервисами
 *
 * Компоненты:
 * - Domain Services: Реализуют бизнес-логику для конкретных доменных объектов
 * - Interactors: Оркестрируют использование доменных сервисов для выполнения
 *   конкретных сценариев использования (use cases)
 */
import { Module } from '@nestjs/common';
import { UserDomainService } from './services/user.domain-service';
import { CardDomainService } from './services/card.domain-service';
import { AccessDomainService } from './services/access.domain-service';
import { AccessInteractor } from './interactors/access.interactor';
import { CardInteractor } from './interactors/card.interactor';
import { UserInteractor } from './interactors/user.interactor';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { PrivateDataDomainService } from './services/private-data.domain-service';

@Module({
  imports: [InfrastructureModule],
  providers: [
    // Доменные сервисы
    UserDomainService,
    CardDomainService,
    AccessDomainService,
    PrivateDataDomainService,

    // Интеракторы (реализация сценариев использования)
    AccessInteractor,
    CardInteractor,
    UserInteractor,
  ],
  exports: [
    UserDomainService,
    CardDomainService,
    AccessDomainService,
    PrivateDataDomainService,
    AccessInteractor,
    CardInteractor,
    UserInteractor,
  ],
})
export class DomainModule {}
