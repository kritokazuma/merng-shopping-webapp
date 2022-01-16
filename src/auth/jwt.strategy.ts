import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtDecodeReturnDto } from './dto/auth-jwt-decode.dto';
import { UserService } from 'src/user/user.service';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  async validate(payload: JwtDecodeReturnDto) {
    const User = await this.findUser(payload);
    if (!User) return null;

    return {
      ...payload,
    };
  }

  async findUser(payload: JwtDecodeReturnDto) {
    const CacheFetch: string = await this.cacheManager.get(payload.id);
    if (!CacheFetch) {
      const User = await this.userService.findById(payload.id);
      User &&
        (await this.cacheManager.set(User._id, JSON.stringify(User), {
          ttl: 60 * 60 * 24,
        }));
      return User;
    }
    return JSON.parse(CacheFetch);
  }
}
