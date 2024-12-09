import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class CoopJwtStrategy extends PassportStrategy(Strategy, 'coop-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'coop_access_secret',
    });
  }

  async validate(payload: any) {
    return { username: payload.username, coopName: payload.coopName };
  }
}
