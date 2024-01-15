import { Module } from '@nestjs/common';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';
import DiscordStrategy from './Strategies/DiscordStrategy';
@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, DiscordStrategy],
})
export class AuthenticationModule {}
