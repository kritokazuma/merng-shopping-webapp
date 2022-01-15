import { CacheModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import * as redisStore from 'cache-manager-ioredis';
import { JwtStrategy } from './jwt.strategy';
import { JwtChangePasswordStratrgy } from './jwt-change-pass.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_URL,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    }),
    UserModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtChangePasswordStratrgy,
  ],
})
export class AuthModule {}
