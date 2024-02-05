import { ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export default class DiscordGuard extends AuthGuard('discord') {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const result = (await super.canActivate(context)) as boolean;
      await super.logIn(request);
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
