import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import AuthenticatedGuard from 'src/authentication/Guards/AuthenticatedGuard';

@Controller('/api/discord')
export default class DiscordController {
  @UseGuards(AuthenticatedGuard)
  @Get('/@me')
  public login(@Req() req: Request) {
    return req.user;
  }
}
