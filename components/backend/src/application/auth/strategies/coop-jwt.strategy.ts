import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from 'src/infrastructure/config/config.service';

@Injectable()
export class CoopJwtStrategy extends PassportStrategy(Strategy, 'coop-jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: any) {
    return { username: payload.username, coopname: payload.coopname };
  }
}
