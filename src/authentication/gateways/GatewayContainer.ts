import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserLoginType } from "@prisma/client";
import { PrismaService } from "src/microservices/database.microservice";
import RedisService from "src/microservices/redis.microservice";
import AuthenticationGateway from "./authentication.gateway";
import DiscordAuthenticationGateway from "./discord.gateway";
import JWTAuthenticationGateway from "./jwt.gateway";

@Injectable()
export default class GatewayContainer {
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