import { Body, Controller, Get, Post, Query, Request } from '@nestjs/common';
import { RequestWithUser } from 'src/shared/requests.type';
import { User } from 'src/shared';
import { QueryPhone } from './dto/query-phone.dto';
import { UserService } from './user.service';
import { Public } from 'src/auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Request() req: RequestWithUser, @Query('_id') _id: string) {
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
