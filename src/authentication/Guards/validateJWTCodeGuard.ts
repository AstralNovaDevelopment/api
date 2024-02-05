import { Injectable, CanActivate, Inject, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import AuthenticationService from "../authentication.service";
import { Request } from "express"
@Injectable()
export default class ValidateJWTCodeGuard implements CanActivate {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const code = this.extractTokenFromBody(request)
    const  data = this.auth.getToken(code)
    if(!data) throw new UnauthorizedException()
    return true;
  }
  private extractTokenFromBody(request: Request): string | undefined {
    const code = request.body.code
    return code !== null ? code : undefined;
  }
}
