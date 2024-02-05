import {  ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import  { AuthGuard } from "@nestjs/passport"
import AuthenticationService from "../authentication.service";

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {
    super()
  }
  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const result = (await super.canActivate(context)) as boolean;
    const verify = await this.auth.verifyToken(this.extractTokenFromHeader(request))
    if(!verify) throw new UnauthorizedException()
    await super.logIn(request);
    return result;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}