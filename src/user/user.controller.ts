import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { Types } from 'mongoose';
import { RequestWithUser } from 'src/auth/dto/requests.type';
import { User } from 'src/shared';
import { QueryPhone } from './dto/query-phone.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(
    @Request() req: RequestWithUser,
    @Query('_id') _id: Types.ObjectId,
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

  @Get('find-phone')
  async findUserByPhone(
    @Request() req: RequestWithUser,
    @Query() query: QueryPhone,
  ) {
    const data = await this.userService.findUserByPhone(
      req.user._id,
      query.phone,
    );
    return data;
  }
}
