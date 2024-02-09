import { Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserLoginType } from "@prisma/client"
import { PrismaService } from "src/microservices/database.microservice"
import RedisService from "src/microservices/redis.microservice"
import AuthenticationGateway from "./abstract.gateway"

export interface Token {
  id: string,
  access: string,
  refresh: string
  expiresIn: number,
}
  
export interface Payload {
  sub: string,
  type: UserLoginType
}

export default class JWTAuthenticationGateway extends AuthenticationGateway<Token> {
  private ACCESS_EXPIRE_IN: number = 172800000
  private REFRESH_EXPIRE_IN: number = 604800000
  private store: Map<string, Token> = new Map()
  constructor(private jwt: JwtService, private redis: RedisService, private prisma: PrismaService) {
    super()
    this.init()
  }

  private async init() {
    for(const user of await this.prisma.user.findMany({ })) {
      const item = await this.redis.get<Token>(user.tokenId);
      if(item) this.store.set(item.id, item)
    }
  }

  public async delete(token: string) {
    const content = await this.get(token)
    if(!content) return false
    await this.redis.getClient().del(content.id)
    return this.store.delete(content.id)
  }

  public async verify(token: string) {
    try {
      const resolver = await this.get(token)
      if(!resolver) return false;
      return await this.jwt.verifyAsync(resolver.access);
    } catch (error) {
      Logger.error(error)
      this.delete(token)
      return null;
    }
  }
  public async get(id: string): Promise<Token> {
    const token = [...this.store.values()].find(k => k.access === id || k.refresh === id) || await this.redis.get<Token>(id)
    if(!token) null
    return token;
  }

  public async create(context: Payload): Promise<Token> {
    const [access, refresh] = await Promise.all([
      this.jwt.signAsync(context, { expiresIn: this.ACCESS_EXPIRE_IN }),
      this.jwt.signAsync(context, { expiresIn: this.REFRESH_EXPIRE_IN })
    ])
    const token: Token = {
      id: crypto.randomUUID(),
      access,
      refresh,
      expiresIn: this.REFRESH_EXPIRE_IN,
    }
    const previousToken = await this.prisma.user.findUnique({ where: { id: context.sub }})
    if(previousToken && previousToken.tokenId) await this.delete(previousToken.tokenId);
    this.redis.set(token.id, token, this.REFRESH_EXPIRE_IN)
    this.store.set(token.id, token)
    return token;
  }

  public async update(id: string, data: Partial<Token>): Promise<Token> {
    const token = await this.get(id);
    const options = Object.assign(token, data)
    this.redis.set(id, options, this.REFRESH_EXPIRE_IN)
    return options;
  }

}
