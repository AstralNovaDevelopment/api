import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import AuthenticatedGuard from '../authentication/guards/authenticated.guard';
import JwtAuthGuard from '../authentication/guards/jwt.guard';
import { Roles } from 'src/authentication/decorator/role.decorator';
import RoleGuard from 'src/authentication/guards/role.guard';

@Controller('/api/discord')
export default class DiscordController {
  @UseGuards(JwtAuthGuard, AuthenticatedGuard)
  @Get('/@me')
  public async me(@Req() req: Request) {
    const user = req.user as User;
    return {
      type: user.type, 
      id: user.id,
      username: user.username,
      avatarURL: user.avatar,
      fetchAt: user.fetchedAt,
      role: user.role
    };
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.MEMBER)
  @Get("/test")
  test() {
    return "hello"
  }
}
