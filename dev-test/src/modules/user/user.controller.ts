import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards, Controller, Req, Post, Body } from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/guards/authenticated.auth.guard';

import { UserService } from './user.service';
import { ChangePasswordDTO } from './dto/changePassword.dto';

export interface IChangePasswordReturnBody {
  message: string;
}

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-password')
  @UseGuards(AuthenticatedGuard)
  @ApiResponse({ status: 200, description: 'Change Password Received' })
  @ApiResponse({ status: 400, description: 'Change Password Failed' })
  async changePassword(
    @Req() req,
    @Body() payload: ChangePasswordDTO,
  ): Promise<IChangePasswordReturnBody | void> {
    return await this.userService.changePassword(
      payload,
      req.session,
      req.user,
    );
  }
}
