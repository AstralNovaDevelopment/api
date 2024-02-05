import {  CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import  { AuthGuard } from "@nestjs/passport"
import GatewayContainer  from "../gateways/GatewayContainer";

@Injectable()
export class ValidateJWTCodeGuard implements CanActivate {
  constructor(@Inject(GatewayContainer) private gateway: GatewayContainer) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const code = this.extractTokenFromBody(request)
    const  gateway = this.gateway.getJWTAuthenticationGateway()
    const data = await gateway.get(code)
    if(!data) throw new UnauthorizedException()
    return true;
  }
  private extractTokenFromBody(request: Request): string | undefined {
    const code = request.body.code
    return code !== null ? code : undefined;
  }
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(GatewayContainer) public gateway: GatewayContainer) {
    super()
  }
  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    const gateway = this.gateway.getJWTAuthenticationGateway()
    const verify = await gateway.verify(this.extractTokenFromHeader(request))
    if(!verify) throw new UnauthorizedException()
    await super.logIn(request);
    return result;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}