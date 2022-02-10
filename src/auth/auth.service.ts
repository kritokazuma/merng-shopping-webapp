import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AuthenticationError,
  UserInputError,
  ForbiddenError,
} from 'apollo-server-express';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { CreateAuthInput } from './dto/create-auth.input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthInput } from './dto/login-auth.input';
import { AddressInput } from './dto/address.input';
import { JwtDecodeReturnDto } from './dto/auth-jwt-decode.dto';
import { Cache } from 'cache-manager';
import { ForgetPasswordInput } from './dto/forget-password.input';
import * as nodemailer from 'nodemailer';
import * as otpGenerator from 'otp-generator';
import { ConfirmOtp } from './dto/confirm-otp.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { JwtResetPasswordDto } from './dto/jwt-reset-password.dto';
import { LoginAndRegisterDto } from './dto/login_n_register.dto';
import { AuthUserReturn } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  //CREATE USER
  async create(createAuthInput: CreateAuthInput): Promise<LoginAndRegisterDto> {
    const User = await this.userService.find(createAuthInput);
    if (User) throw new UserInputError('username or email already register');

    const hash = await this.hash(createAuthInput.password);

    const createUser = new this.userModel({
      ...createAuthInput,
      password: hash,
    });

    await createUser.save();

    return {
      email: createUser.email,
      username: createUser.username,
      token: this.generateToken(this.payload(createUser)),
    };
  }

  //LOGIN USER
  async login(loginAuthInput: LoginAuthInput): Promise<AuthUserReturn> {
    const User = await this.userService.find(loginAuthInput);

    const comparePassword = !User
      ? false
      : await this.compare(loginAuthInput.password, User.password);
    if (!comparePassword) {
      throw new UserInputError('wrong username or password');
    }

    return {
      email: User.email,
      username: User.username,
      token: await this.generateToken(this.payload(User)),
    };
  }

  //Add Address
  async address(
    addressInput: AddressInput,
    user: JwtDecodeReturnDto,
  ): Promise<string> {
    const User = await this.userService.findById(user.id);
    if (!User) throw new AuthenticationError('User not found');
    User.location.push(addressInput);
    await User.save();
    return 'success';
  }

  async forgetPassword(
    forgetPasswordInput: ForgetPasswordInput,
  ): Promise<string> {
    const User = await this.userService.findByEmail(forgetPasswordInput.email);
    if (!User) throw new UserInputError('user not found');

    const prefixRequestUser = `${forgetPasswordInput.email}#requestedTimes`;

    const requestedTimes = await this.cacheManager.get(prefixRequestUser);

    if (requestedTimes >= 3) throw new ForbiddenError('exceed limit');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //6 digits of otp generate
    const otp: string = await otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const hashOtp = await bcrypt.hash(otp, 10);

    const otpTtl = 60 * 5;

    await this.cacheManager.set(forgetPasswordInput.email, hashOtp, {
      ttl: otpTtl,
    });

    await this.cacheManager.set(
      prefixRequestUser,
      requestedTimes ? Number(requestedTimes) + 1 : 1,
      { ttl: 60 * 60 * 24 },
    );

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: forgetPasswordInput.email,
      subject: `<b>${otp}</b> is your account recovery code`,
      html: `<p>Hi ${User.username}</p><p>We recived a request to rest your account.Enter following code. ${otp}</p>`,
    });

    return 'requested';
  }

  async comfirmResetPasswordOtp(
    confirmOtp: ConfirmOtp,
  ): Promise<{ token: string }> {
    const User = await this.userService.findByEmail(confirmOtp.email);
    const otp: string = await this.cacheManager.get(confirmOtp.email);
    const compareOtp = !User
      ? false
      : !otp
      ? false
      : await this.compare(confirmOtp.otp, otp);
    if (!compareOtp) throw new AuthenticationError('wrong otp');
    await this.cacheManager.del(confirmOtp.email);
    return {
      token: this.jwtService.sign(
        {
          email: confirmOtp.email,
          type: 'reset',
        },
        { expiresIn: '5m' },
      ),
    };
  }

  async resetPassword(
    inputNewPassword: ResetPasswordInput,
    jwtResetPassword: JwtResetPasswordDto,
  ): Promise<string> {
    if (jwtResetPassword.type !== 'reset')
      throw new AuthenticationError('wrong token');

    const User = await this.userService.findByEmail(jwtResetPassword.email);

    if (!User) throw new UserInputError('user not found');
    if (inputNewPassword.password !== inputNewPassword.confirmPassword) {
      throw new UserInputError('password must be same as confirm password');
    }

    const hash = await this.hash(inputNewPassword.password);
    User.password = hash;
    await User.save();
    return 'success';
  }

  //HASH PASSWORD
  private async hash(password: string) {
    return await bcrypt.hash(password, 10);
  }

  //COMPARE PASSWORD WITH BCRYPT
  private async compare(inputPassword: string, storedPassword: string) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }

  //GENERATE JWT TOKEN
  private generateToken(userPayload: JwtDecodeReturnDto) {
    return this.jwtService.sign(userPayload);
  }

  //PAYLOAD FOR JWT
  private payload(UserDetails) {
    return {
      id: UserDetails._id,
      email: UserDetails.email,
      username: UserDetails.username,
      avatar: UserDetails.avatar,
      role: UserDetails.role,
    };
  }
}
