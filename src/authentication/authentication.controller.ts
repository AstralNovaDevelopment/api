import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import AuthenticationService from './authentication.service';
import DiscordGuard from './guards/DiscordGuard';
import { Request, Response } from 'express';
import AuthenticatedGuard from './guards/AuthenticatedGuard';
import { ValidateJWTCodeGuard } from './guards/JWTGuard';


@Controller('/api/authentication')
export default class AuthenticationController {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {}

  @UseGuards(DiscordGuard)
  @Get('/discord/login')
  public getDiscordLogin() {
    return;
  }

  @UseGuards(DiscordGuard)
  @Get('/discord/authorize')
  public async getAuth(@Res() res: Response, @Req() req: Request) {
    return res.redirect(`zenflow://auth?code=${req.user["tokenId"]}`)
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/logout")
  public async logout(@Req() req: Request, res: Response) {
    req.logOut({ keepSessionInfo: false }, (err) => Logger.error(err))
    return res.status(200).json({ status: 200, message: "success" })
  }

  @Post('/token')
  @UseGuards(ValidateJWTCodeGuard)
  public async getToken(@Body() body: Record<string, string>) {
    return this.auth.getToken(body.code)
  }

  @Post("/token/revoke")
  @UseGuards(ValidateJWTCodeGuard)
  public async revokeToken(@Body() body: Record<string, string>) {
    return this.auth.revokeToken(body.code)
  }
}
