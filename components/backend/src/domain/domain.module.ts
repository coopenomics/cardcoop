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
    UserDomainService,
    CardDomainService,
    AccessDomainService,
    PrivateDataDomainService,

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
