import { Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DiscordModule } from './discord/Discord.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnvironmentSchema } from './util/validate.schema';
import { PassportModule } from '@nestjs/passport';
import { json, urlencoded } from 'express';
import * as cors from 'cors';
import * as sessions from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import MicroservicesModule from './microservices/microservice.module';
import RedisService from './microservices/redis.microservice';


@Module({
  imports: [
    DiscordModule,
    AuthenticationModule,
    {
      module: MicroservicesModule,
      providers: [MicroservicesModule],
      global: true,
    },
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validate: (config) => validateEnvironmentSchema.parse(config),
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  constructor(@Inject(ConfigService) private config: ConfigService, @Inject(RedisService) private redis: RedisService) {}
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        json(),
        urlencoded({ extended: false }),
        cors({
          credentials: true,
          preflightContinue: true,
        }),
        sessions({
          cookie: {
            maxAge: 86400000,
          },
          store: new RedisStore({
            client: this.redis.getClient(),
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
