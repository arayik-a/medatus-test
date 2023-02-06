import {
  Injectable,
  BadRequestException,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Session } from 'express-session';
import { InjectModel } from '@nestjs/mongoose';

import { RegisterDTO } from '../auth/dto/register.dto';

import { IUser } from './user.model';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { IChangePasswordReturnBody } from './user.controller';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  get(id: string): Promise<IUser> {
    return this.userModel.findById(id).exec();
  }

  getByUsername(username: string): Promise<IUser> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(payload: RegisterDTO): Promise<IUser> {
    const user = await this.getByUsername(payload.username);

    if (user) {
      throw new NotAcceptableException(
        'The account with the provided username currently exists. Please choose another one.',
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const createdUser = new this.userModel({
      ...payload,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async changePassword(
    payload: ChangePasswordDTO,
    session: Session,
    user: IUser,
  ): Promise<IChangePasswordReturnBody | void> {
    const { oldPassword, newPassword } = payload;

    const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await this.userModel.updateOne(
      { username: user.username },
      {
        password: hashedNewPassword,
      },
    );

    if (updatedUser.modifiedCount !== 1) {
      throw new BadRequestException(
        'The user with that username does not exist in the system. Please try another username.',
      );
    }

    session.regenerate((err) => {
      if (err) {
        throw new BadRequestException('Failed to change password');
      }
    });

    return {
      message: 'Password changed successfully, please login again',
    };
  }
}
