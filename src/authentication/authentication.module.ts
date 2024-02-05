import { Module } from '@nestjs/common';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';
import DiscordStrategy from './strategies/DiscordStrategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import MicroservicesModule from 'src/microservices/microservice.module';
import { SessionSerializer } from './strategies/SessionSerializer';
import { JwtStrategy } from './strategies/JwtStrategy';
import GatewayContainer from './gateways/gatewayContainer';

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
  exports: [AuthenticationService, GatewayContainer],
})
export class AuthenticationModule {}

