import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { IUser } from '../user/user.model';
import { UserService } from '../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: IUser, done: (err: Error, user: IUser) => void): void {
    done(null, user);
  }

  async deserializeUser(
    user: IUser,
    done: (err: Error, user: IUser) => void,
  ): Promise<void> {
    const foundUser = await this.userService.getByUsername(user.username);

    done(null, foundUser);
  }
}
