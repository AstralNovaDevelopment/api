import {  Inject, Injectable } from '@nestjs/common';
import AuthenticationGateway from './gateways/authentication.gateway';
import {  User, UserLoginType } from '@prisma/client';
import GatewayContainer from './gateways/GatewayContainer';
import { Payload } from './gateways/JWTAuthenticationGateway';

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

