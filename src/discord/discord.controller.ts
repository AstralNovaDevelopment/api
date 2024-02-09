import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import AuthenticatedGuard from '../authentication/guards/authenticated.guard';
import JwtAuthGuard from 'src/authentication/guards/jwt.guard';
@Controller('/api/discord')
export default class DiscordController {
  @UseGuards(JwtAuthGuard, AuthenticatedGuard)
  @Get('/@me')
  public async me(@Req() req: Request) {
    const user = req.user as Omit<User, "tokenId">;
    console.log(user)
    return {
      type: user.type, 
      id: user.id,
      username: user.username,
      avatarURL: user.avatar,
      fetchAt: user.fetchedAt,
      role: user.role
    };
  }
}
