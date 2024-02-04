import { Module } from '@nestjs/common';
import { PrismaService } from './database.microservice';
import RedisService from './redis.microservice';

@Module({
  providers: [PrismaService, RedisService],
  exports: [PrismaService, RedisService],
})
export default class MicroservicesModule {}
