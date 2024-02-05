import {  Inject, Injectable } from '@nestjs/common';
import {  User, UserLoginType } from '@prisma/client';
import GatewayContainer from './gateways/gateway.container';
import { Payload, Token } from './gateways/jwt.gateway';

@Injectable()
export default class AuthenticationService {
  constructor(@Inject(GatewayContainer) private gateway: GatewayContainer) {}

  public async verifyUser(type: UserLoginType, user: User) {
    const provider = this.gateway.getAuthenticationProvider<User>(type);
    return await provider.verify(user);
  }

  public async revokeToken(token: string) {
    const provider = this.gateway.getAuthenticationProvider<Token>("JWT")
    return provider.delete(token)
  }

  public async verifyToken(code: string) {
    const provider = this.gateway.getAuthenticationProvider<Token>("JWT")
    return provider.verify(code)
  }
  public async getUser(type: UserLoginType, id: string) {
    const provider = this.gateway.getAuthenticationProvider<User>(type);
    return await provider.get(id);
  }

  public async updateUser(type: UserLoginType, id: string, data: Partial<User>) {
    const provider = this.gateway.getAuthenticationProvider<User>(type);
    return await provider.update(id, data);
  }

  public async getToken(code: string) {
    const provider = this.gateway.getAuthenticationProvider<Token>("JWT")
    return provider.get(code)
  }
  public async generateToken(payload: Payload) {
    const provider = this.gateway.getAuthenticationProvider<Token>("JWT")
    return provider.create(payload)
  }
}

