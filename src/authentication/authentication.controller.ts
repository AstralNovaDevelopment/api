import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import AuthenticationService from './authentication.service';
import DiscordGuard from './guards/discord.guard';
import { Request, Response } from 'express';
import AuthenticatedGuard from './guards/authenticated.guard';
import JWTCodeGuard from './guards/jwtCode.guard';

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
  public async getAuth(@Res() res: Response) {
    return res.redirect('/api/authentication/oauth2/authorized')
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/oauth2/authorized")
  public authorized(@Res() res: Response, @Req() req: Request) {
    return res.redirect(`zenflow://auth?code=${req.user["tokenId"]}`)
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/logout")
  public async logout(@Req() req: Request, @Res() res: Response) {
    await this.auth.revokeToken(req.user["tokenId"])
    req.logOut({ keepSessionInfo: false }, (err) => err && Logger.error(err))
    return res.status(200).json({ status: 200, message: "success" })
  }

  @Post('/token')
  @UseGuards(JWTCodeGuard)
  public async getToken(@Body() body: Record<string, string>) {
    const token = await this.auth.getToken(body.code)
    if(!token) throw new UnauthorizedException()
    return token;
  }

  @Post("/token/revoke")
  @UseGuards(JWTCodeGuard)
  public async revokeToken(@Body() body: Record<string, string>) {
    return this.auth.revokeToken(body.code)
  }
}
