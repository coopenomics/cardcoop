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
