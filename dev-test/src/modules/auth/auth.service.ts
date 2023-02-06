import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IUser } from '../user/user.model';
import { UserService } from '../user/user.service';

import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser({ username, password }: LoginDTO): Promise<IUser> {
    const user = await this.userService.getByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    return user;
  }
}
