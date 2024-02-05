import { Injectable, CanActivate, Inject, ExecutionContext, UnauthorizedException, BadRequestException } from "@nestjs/common";
import AuthenticationService from "../authentication.service";
import { Request } from "express"
@Injectable()
export default class JWTCodeGuard implements CanActivate {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const code = this.extractTokenFromBody(request)
    if(!code) throw new BadRequestException()
    const data = this.auth.getToken(code)
    if(!data) throw new UnauthorizedException()
    return true;
  }
  private extractTokenFromBody(request: Request): string | undefined {
    const code = request.body.code
    return code !== null ? code : undefined;
  }
}
