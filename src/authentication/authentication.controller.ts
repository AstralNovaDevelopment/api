import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import AuthenticationService from './authentication.service';
import DiscordGuard from './Guards/DiscordGuard';
import { Response } from 'express';

@Controller('/api/authentication')
export default class AuthenticationController {
  constructor(
    @Inject(AuthenticationService) public auth: AuthenticationService,
  ) {}

  @UseGuards(DiscordGuard)
  @Get('/discord/login')
  public getDiscordLogin() {
    return;
  }

  @UseGuards(DiscordGuard)
  @Get('/discord/authorize')
  public getAuth(@Res() res: Response) {
    return res.redirect('/api/discord/@me');
  }
}
