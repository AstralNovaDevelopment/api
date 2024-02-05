import { Module } from '@nestjs/common';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';
import DiscordStrategy from './strategies/discord.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import MicroservicesModule from 'src/microservices/microservice.module';
import { SessionSerializer } from './strategies/session.serializer';
import JwtStrategy from './strategies/jwt.strategy';
import GatewayContainer from './gateways/gateway.container';

@Module({
  imports: [
    MicroservicesModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, DiscordStrategy, JwtStrategy, SessionSerializer, GatewayContainer],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}

