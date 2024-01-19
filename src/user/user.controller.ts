import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async register() {
    const data = await this.userService.gettt();
    return {
      data: data,
    };
  }
}
