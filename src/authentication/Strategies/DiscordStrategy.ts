import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-discord';

@Injectable()
export default class DiscordStrategy extends PassportStrategy(
  Strategy,
  'discord',
) {
  constructor(
    @Inject(ConfigService) config: ConfigService<Record<string, any>, true>,
  ) {
    super({
      clientSecret: config.get('DISCORD_CLIENT_SECRET'),
      callbackURL: config.get('DISCORD_CALLBACK'),
      clientID: config.get('DISCORD_CLIENT_ID'),
      scope: ['identify'],
    });
  }
  public validate(accessToken: string, refreshToken: string, profile: Profile) {
    return profile;
  }
}
