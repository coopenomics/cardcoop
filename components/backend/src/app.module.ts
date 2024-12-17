import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делает ConfigModule доступным во всем приложении
    }),
    DomainModule,
    ApplicationModule,
    InfrastructureModule,
  ],
  controllers: [
  ],
  providers: [
    
  ],
})
export class AppModule {}
