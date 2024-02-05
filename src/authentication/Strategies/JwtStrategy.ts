import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import AuthenticationService from '../authentication.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService, @Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_SECRET"),
      ignoreExpiration: true,
    });
  }

  public async validate(payload) {
    const user = await this.auth.getUser(payload.type, payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}