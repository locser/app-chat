import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { Types } from 'mongoose';
import { RequestWithUser } from 'src/auth/dto/requests.type';
import { User } from 'src/shared';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @Request() req: RequestWithUser,
    @Param('_id') _id: Types.ObjectId,
  ) {
    const data = await this.userService.getProfile(req.user._id, _id);
    return data;
  }

  @Post('update')
  async updateUser(
    @Request() req: RequestWithUser,
    @Body() body: Partial<User>,
  ) {
    const data = await this.userService.updateUser(req, body);
    return data;
  }
}
