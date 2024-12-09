import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './infrastructure/auth.controller';
import { CardController } from './infrastructure/card.controller';
import { AccessController } from './infrastructure/access.controller';
import { AuthService } from './application/auth.service';
import { CardService } from './application/card.service';
import { AccessService } from './application/access.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { UserDomainService } from './domain/services/user.domain-service';
import { CardDomainService } from './domain/services/card.domain-service';
import { AccessDomainService } from './domain/services/access.domain-service';
import { CoopJwtStrategy } from './infrastructure/strategies/coop-jwt.strategy';
import { CoopJwtAuthGuard } from './infrastructure/guards/coop-jwt-auth.guard';
import { DatabaseModule } from './infrastructure/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: 'access_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [
    AuthController, CardController, AccessController
  ],
  providers: [
    AuthService,
    CardService,
    AccessService,
    JwtStrategy,
    JwtAuthGuard,
    UserDomainService,
    CardDomainService,
    AccessDomainService,
    CoopJwtStrategy,
    CoopJwtAuthGuard,
  ],
})
export class AppModule {}
