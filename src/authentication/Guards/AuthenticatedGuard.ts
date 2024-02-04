import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export default class AuthenticatedGuard implements CanActivate {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}