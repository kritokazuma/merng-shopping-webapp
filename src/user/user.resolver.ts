import { UseGuards } from '@nestjs/common';
import { Context, Resolver, Query } from '@nestjs/graphql';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntities } from './entities/user.entities';
import { User } from './user.schema';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private userService: UserService,
  ) {}

  @Query(() => UserEntities)
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Context() context): Promise<UserEntities> {
    return await this.userService.getUserInfo(context.req.user);
  }
}
