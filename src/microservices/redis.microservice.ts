import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export default class RedisService implements OnModuleDestroy {
    private readonly client: Redis
    constructor(
        @Inject(ConfigService) config: ConfigService 
    ) {
        this.client = new Redis({ port: config.get("REDIS_CACHE_PORT") })
    }

    public async get<T>(id: string): Promise<T | null> {
        const item = await this.client.get(id)
        if(!item) return null;
        return JSON.parse(item);
    }

    public async set<T extends object>(key: string, value: T, ttl?: number) {
        const data =  JSON.stringify(value);
        return ttl ? await this.client.setex(key, ttl, data) : await this.client.set(key, data)
    }

    public getClient() {
        return this.client;
    }
    public async onModuleDestroy() {
        this.client.disconnect()
    }

}
