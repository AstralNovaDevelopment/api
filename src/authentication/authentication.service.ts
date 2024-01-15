import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export default class AuthenticationService {
  constructor(@Inject(ConfigService) public config: ConfigService) {}
}
