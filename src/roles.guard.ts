import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtDecodeReturnDto } from 'src/auth/dto/auth-jwt-decode.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const user: JwtDecodeReturnDto = ctx.getContext().req.user;
    return roles.includes(user.role);
  }
}
