import { Module } from '@nestjs/common';
import DiscordController from './discord.controller';

@Module({
  imports: [],
  controllers: [DiscordController],
  providers: [],
})
export class DiscordModule {}
