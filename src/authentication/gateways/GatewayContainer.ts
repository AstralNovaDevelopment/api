import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserLoginType } from "@prisma/client";
import { PrismaService } from "src/microservices/database.microservice";
import RedisService from "src/microservices/redis.microservice";
import AuthenticationGateway from "./authentication.gateway";
import DiscordAuthenticationGateway from "./discord.gateway";
import JWTAuthenticationGateway from "./JWTAuthenticationGateway";

@Injectable()
export default class GatewayContainer {
  private authenticationGateways: Record<string, AuthenticationGateway> = {};
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(RedisService) redis: RedisService, @Inject(JwtService) jwt: JwtService) {
    this.registerGateway("DISCORD", new DiscordAuthenticationGateway(prisma))
    this.registerGateway("JWT", new JWTAuthenticationGateway(jwt, redis, prisma))
  }
  
  private registerGateway(type: UserLoginType, gateway: AuthenticationGateway) {
    this.authenticationGateways[type] = gateway;
    return this;
  }

  public getAuthenticationProvider<T>(type: UserLoginType) {
    return this.getProvider<AuthenticationGateway<T>>(type)
  }
  private getProvider<T extends AuthenticationGateway>(type: UserLoginType): T {
    const provider = this.authenticationGateways[type] as T;
    if (!provider) throw new UnauthorizedException('Unsupported Authentication provider');
    return provider;
  }
}