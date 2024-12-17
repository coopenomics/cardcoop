import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CoopJwtAuthGuard } from "./guards/coop-jwt-auth.guard";
import { CoopJwtStrategy } from "./strategies/coop-jwt.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
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
