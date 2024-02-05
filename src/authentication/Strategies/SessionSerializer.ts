import { PassportSerializer } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import AuthenticationService from '../authentication.service';
import { User } from '@prisma/client';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(AuthenticationService) private auth: AuthenticationService) {
    super()

  }
  serializeUser(user: User, done: (error: Error, user: any) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user) => void) {
    return user ? done(null, user) : done(null, null)
  }
}
