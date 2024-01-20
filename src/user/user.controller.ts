import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile() {
    const data = await this.userService.getProfile();
    return {
      data: data,
    };
  }

  @Post('update')
  async updateUser() {
    const data = await this.userService.updateUser();
    return {
      data: data,
    };
  }
}
