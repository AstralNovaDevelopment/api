import { Injectable, CanActivate, Inject, ExecutionContext, BadRequestException } from "@nestjs/common";
import AuthenticationService from "../authentication.service";
import { Request } from "express"
@Injectable()
export default class JWTCodeGuard implements CanActivate {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = await this.auth.getToken(this.extractTokenFromBody(request));
    if (!token) throw new BadRequestException("No token found in the request body or the token could not be processed.");
    return Boolean(token);
  }
  private extractTokenFromBody(request: Request): string | undefined {
    const code = request.body.code
    return code !== null ? code : undefined;
  }
}
