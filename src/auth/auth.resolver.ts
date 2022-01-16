import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthService } from './auth.service';
import {
  AuthUserReturn,
  forgetPasswordConfirmOtpReturn,
} from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { LoginAuthInput } from './dto/login-auth.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './gql-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtDecodeReturnDto } from './dto/auth-jwt-decode.dto';
import { AddressInput } from './dto/address-input.dto';
import * as otpGenerator from 'otp-generator';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { ConfirmOtp } from './dto/confirm-otp.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { JwtChangePasswordGuard } from './jwt-change-pass.guard';

@Resolver(() => AuthUserReturn)
export class AuthResolver {
  private pubSub: PubSub;
  constructor(private readonly authService: AuthService) {
    this.pubSub = new PubSub();
  }

  //TEST route
  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  async hello(@Context() context) {
    return 'hello world';
  }

  //Register route
  @Mutation(() => AuthUserReturn)
  async register(@Args('createAuthInput') createAuthInput: CreateAuthInput) {
    const User = await this.authService.create(createAuthInput);
    return User;
  }

  //Login route
  @Mutation(() => AuthUserReturn)
  @UseGuards(GqlAuthGuard)
  async login(
    @Args('loginAuthInput') loginAuthInput: LoginAuthInput,
    @Context() context,
  ) {
    return context.user;
  }

  //Add address
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async addAddress(
    @Args('addressInput') addressInput: AddressInput,
    @Context() context,
  ) {
    return this.authService.address(addressInput, context.req.user);
  }

  //forget Password
  @Mutation(() => String)
  async forgetPassword(
    @Args('forgetPasswordInput') forgetPasswordInput: ForgetPasswordInput,
  ) {
    return await this.authService.forgetPassword(forgetPasswordInput);
  }

  @Mutation(() => forgetPasswordConfirmOtpReturn)
  async confirmResetPasswordOtp(@Args('confirmOtp') confirmOtp: ConfirmOtp) {
    return await this.authService.comfirmResetPasswordOtp(confirmOtp);
  }

  @Mutation(() => String)
  @UseGuards(JwtChangePasswordGuard)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
    @Context() context,
  ) {
    return await this.authService.resetPassword(
      resetPasswordInput,
      context.req.user,
    );
  }
}
