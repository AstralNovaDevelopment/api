import { Module } from '@nestjs/common';
import DiscordController from './discord.controller';
import { AuthenticationModule } from 'src/authentication/authentication.module';
@Module({
  imports: [AuthenticationModule],
  controllers: [DiscordController],
  providers: [],
})
export class DiscordModule {}
