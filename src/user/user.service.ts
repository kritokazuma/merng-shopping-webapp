import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthInput } from 'src/auth/dto/create-auth.input';
import { Item } from 'src/items/items.schema';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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
