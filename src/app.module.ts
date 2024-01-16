import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DiscordModule } from './discord/Discord.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironmentSchema } from './util/validate.schema';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './authentication/SessionSerializer';
import * as cors from 'cors';
import * as sessions from 'express-session';
import * as passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

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
export class AppModule implements NestModule {
  constructor(@Inject(ConfigService) private config: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          credentials: true,
          preflightContinue: true,
        }),
        sessions({
          cookie: {
            maxAge: 86400000,
          },
          store: new PrismaSessionStore(new PrismaClient(), {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
          }),
          secret: this.config.get('SESSION_SECRET'),
          resave: false,
          saveUninitialized: false,
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
