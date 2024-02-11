import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
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
  private redirectURL = (token: string) => `/api/authentication/oauth2/authorized?code=${token}` as const;
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {}

  @UseGuards(DiscordGuard)
  @Get('/discord/login')
  public getDiscordLogin() {
    return;
  }

  @UseGuards(DiscordGuard)
  @Get('/discord/authorize')
  public async getAuth(@Res() res: Response, @Req() req: Request) {
    return res.redirect(this.redirectURL(req.user['tokenId']))
  }

  @UseGuards(AuthenticatedGuard)
  @Get("/oauth2/authorized")
  public authorized(@Res() res: Response, @Query() query: Record<string, string>) {
    return res.redirect(`zenflow://auth?code=${query.code}`)
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
    const once = this.auth.validateCode(body.code);
    const token = once && await this.auth.getToken(body.code)
    if(!token) throw new UnauthorizedException()
    this.auth.deleteCode(token.id)
    return token;
  }

  @Post("/token/revoke")
  @UseGuards(JWTCodeGuard)
  public async revokeToken(@Body() body: Record<string, string>) {
    return this.auth.revokeToken(body.code)
  }
}
