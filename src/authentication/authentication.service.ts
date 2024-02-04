import {  Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationGateway, DiscordAuthenticationGateway, JWTAuthenticationGateway, Payload } from './authentication.gateway';
import { PrismaService } from 'src/microservices/database.microservice';
import {  User, UserLoginType } from '@prisma/client';
import RedisService from 'src/microservices/redis.microservice';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GatewayContainer {
  private authenticationGateways: Record<string, AuthenticationGateway> = {};
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(RedisService) redis: RedisService, @Inject(JwtService) jwt: JwtService) {
    this.registerAuthenticationGateway("DISCORD", new DiscordAuthenticationGateway(prisma))
    this.registerAuthenticationGateway("JWT", new JWTAuthenticationGateway(jwt, redis, prisma))
  }
  
  public registerAuthenticationGateway(type: UserLoginType, gateway: AuthenticationGateway) {
    this.authenticationGateways[type] = gateway;
    return this;
  }

  public getJWTAuthenticationGateway() {
    return this.getAuthenticationProvider<JWTAuthenticationGateway>("JWT")
  }

  public getAuthenticationProvider<T extends AuthenticationGateway>(type: UserLoginType): T {
    const provider = this.authenticationGateways[type] as T;
    if (!provider) throw new UnauthorizedException('Unsupported Authentication provider');
    return provider;
  }
}

@Injectable()
export default class AuthenticationService {
  constructor(@Inject(GatewayContainer) private gateway: GatewayContainer) {}

  public async verifyUser(type: UserLoginType, user: User): Promise<User> {
    const provider = this.gateway.getAuthenticationProvider<AuthenticationGateway<User>>(type);
    return await provider.verify(user);
  }

  public async revokeToken(token: string) {
    const provider = this.gateway.getJWTAuthenticationGateway()
    return provider.revoke(token)
  }
  public async getUser(authType:UserLoginType, id: string) {
    const provider = this.gateway.getAuthenticationProvider<AuthenticationGateway<User>>(authType);
    return await provider.get(id);
  }

  public async updateUser(authType: UserLoginType, id: string, data: Partial<User>) {
    const provider = this.gateway.getAuthenticationProvider<AuthenticationGateway<User>>(authType);
    return await provider.update(id, data);
  }

  public async getToken(code: string) {
    const provider = this.gateway.getJWTAuthenticationGateway()
    return provider.get(code)
  }
  public async generateToken(payload: Payload) {
    const provider = this.gateway.getJWTAuthenticationGateway()
    return provider.create(payload)
  }
}

