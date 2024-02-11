import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';
import AuthenticationService from '../authentication.service';
import { User } from '@prisma/client';

@Injectable()
export default class DiscordStrategy extends PassportStrategy(
  Strategy,
  'discord',
) {
  constructor(
    @Inject(AuthenticationService)  private auth: AuthenticationService,
    @Inject(ConfigService) config: ConfigService<Record<string, any>, true>,
  ) {
    super({
      clientSecret: config.get('DISCORD_CLIENT_SECRET'),
      callbackURL: config.get('DISCORD_CALLBACK'),
      clientID: config.get('DISCORD_CLIENT_ID'),
      scope: ['identify'],
    });
  }
  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const [token, user] = await Promise.all([this.auth.generateToken({ sub: profile.id, type: "DISCORD" }), this.auth.getUser("DISCORD", profile.id)])
    const data: Partial<User> = { 
      tokenId: token.id,
      type: "DISCORD",
      role: user ? user.role : "MEMBER",
      avatar: profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.webp?size=512`
        : 'https://cdn.discordapp.com/embed/avatars/0.png',
      username: profile.username,
      id: profile.id,
      fetchedAt: new Date(profile.fetchedAt),
    };
   const verify = await this.auth.verifyUser(data.type, data)
   return verify;
  }
}
 