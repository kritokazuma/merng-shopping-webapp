import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthService } from './auth.service';
import {
  AuthUserReturn,
  forgetPasswordConfirmOtpReturn,
} from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { LoginAuthInput } from './dto/login-auth.input';
import { UseGuards } from '@nestjs/common';
import { GqlLocalAuthGuard } from './gql-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AddressInput } from './dto/address.input';
import { ForgetPasswordInput } from './dto/forget-password.input';
import { ConfirmOtp } from './dto/confirm-otp.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { JwtChangePasswordGuard } from './jwt-change-pass.guard';
import { LoginAndRegisterDto } from './dto/login_n_register.dto';

@Resolver(() => AuthUserReturn)
export class AuthResolver {
  private pubSub: PubSub;
  constructor(private readonly authService: AuthService) {
    this.pubSub = new PubSub();
  }

  /**
   * register user
   * @param createAuthInput user credentials which are needed to register
   * @returns AuthUserReturn
   */
  @Mutation(() => AuthUserReturn)
  async register(
    @Args('createAuthInput') createAuthInput: CreateAuthInput,
  ): Promise<AuthUserReturn> {
    const User = await this.authService.create(createAuthInput);
    return User;
  }

  /**
   * login user
   * @param loginAuthInput username and password
   * @param context user
   * @returns AuthUserReturn
   */
  @Mutation(() => AuthUserReturn)
  @UseGuards(GqlLocalAuthGuard)
  async login(
    @Args('loginAuthInput') loginAuthInput: LoginAuthInput,
    @Context() context,
  ): Promise<AuthUserReturn> {
    return context.user;
  }

  /**
   * add address to user
   * @param addressInput region, township and address
   * @param context user
   * @returns Promise<string>
   */
  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async addAddress(
    @Args('addressInput') addressInput: AddressInput,
    @Context() context,
  ): Promise<string> {
    return this.authService.address(addressInput, context.req.user);
  }

  /**
   * forget password, make request otp
   * @param forgetPasswordInput email
   * @returns Promise<string>
   */
  @Mutation(() => String)
  async forgetPassword(
    @Args('forgetPasswordInput') forgetPasswordInput: ForgetPasswordInput,
  ): Promise<string> {
    return await this.authService.forgetPassword(forgetPasswordInput);
  }

  /**
   * confirm otp
   * @param confirmOtp email and otp code
   * @returns {token: string}
   */
  @Mutation(() => forgetPasswordConfirmOtpReturn)
  async confirmResetPasswordOtp(
    @Args('confirmOtp') confirmOtp: ConfirmOtp,
  ): Promise<{ token: string }> {
    return await this.authService.comfirmResetPasswordOtp(confirmOtp);
  }

  /**
   * reset password, input password and confirm password
   * @param resetPasswordInput password and confirm password
   * @param context user
   * @returns Promise<string>
   */
  @Mutation(() => String)
  @UseGuards(JwtChangePasswordGuard)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
    @Context() context,
  ): Promise<string> {
    return await this.authService.resetPassword(
      resetPasswordInput,
      context.req.user,
    );
  }
}
