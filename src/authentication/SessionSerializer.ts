import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (error: Error, user: any) => void) {
    done(null, user);
  }

  async deserializeUser(user: any, done: (err, user) => void) {
    return done(null, user);
  }
}
