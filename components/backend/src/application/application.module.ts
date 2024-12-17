import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { CardController } from './controllers/card.controller';
import { AccessController } from './controllers/access.controller';
import { AuthService } from './services/auth.service';
import { CardService } from './services/card.service';
import { AccessService } from './services/access.service';
import { DomainModule } from 'src/domain/domain.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DomainModule,
    AuthModule
  ],
  controllers: [
    AuthController, CardController, AccessController
  ],
  providers: [
    AuthService,
    CardService,
    AccessService,
  ],
  exports: [
    AuthModule
  ]
})
export class ApplicationModule {}
