import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CoopJwtAuthGuard } from "./guards/coop-jwt-auth.guard";
import { CoopJwtStrategy } from "./strategies/coop-jwt.strategy";
import { InfrastructureModule } from "src/infrastructure/infrastructure.module";
import { ConfigService } from "src/infrastructure/config/config.service";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [InfrastructureModule], // Импортируем ConfigModule
      inject: [ConfigService], // Инжектируем ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: `${configService.accessTokenExpirationDays}d`,
        },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    CoopJwtStrategy,
    CoopJwtAuthGuard,
  ],
  exports: [
    PassportModule
  ],
})

export class AuthModule {}
