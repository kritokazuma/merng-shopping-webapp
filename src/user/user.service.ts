import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthInput } from 'src/auth/dto/create-auth.input';
import { LoginAuthInput } from 'src/auth/dto/login-auth.input';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async find(createAuthInput: CreateAuthInput) {
    return await this.userModel.findOne({ username: createAuthInput.username });
  }

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
