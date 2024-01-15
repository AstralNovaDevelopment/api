import { Module } from '@nestjs/common';
import { DiscordModule } from './discord/Discord.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnvironmentSchema } from './util/validate.schema';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './authentication/SessionSerializer';

@Module({
  imports: [
    DiscordModule,
    AuthenticationModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: (config) => validateEnvironmentSchema.parse(config),
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  providers: [SessionSerializer],
})
export class AppModule {}
