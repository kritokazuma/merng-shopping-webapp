import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtResetPasswordDto } from './dto/jwt-reset-password.dto';

@Injectable()
export class JwtChangePasswordStratrgy extends PassportStrategy(
  Strategy,
  'jwt-change-pass',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: JwtResetPasswordDto) {
    return {
      ...payload,
    };
  }
}
