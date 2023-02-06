import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Post, UseGuards, Controller, Req } from '@nestjs/common';

import { IUser } from '../user/user.model';
import { UserService } from '../user/user.service';

import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local.auth.guard';

interface IAuthReturnBody {
  user: IUser;
  message: string;
}

@Controller('api/auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 201, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Req() req, @Body() payload: LoginDTO): Promise<IAuthReturnBody> {
    return {
      user: req.user,
      message: 'User successfully logged in',
    };
  }

  @Post('register')
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterDTO): Promise<IAuthReturnBody> {
    const user = await this.userService.create(payload);

    return {
      user,
      message: 'User successfully registered',
    };
  }

  @Post('logout')
  @ApiResponse({ status: 201, description: 'User successfully logged out' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req): Promise<IAuthReturnBody> {
    req.session.destroy();

    return {
      user: null,
      message: 'User successfully logged out',
    };
  }
}
