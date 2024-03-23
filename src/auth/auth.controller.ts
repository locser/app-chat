import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestWithUser } from '../shared/requests.type';
import { LoginDto } from './dto/user-sign-in.dto';
import { SignUpDto } from './dto/user-sign-up.dto';
import { Public } from './roles.decorator';
import { User } from 'src/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: LoginDto) {
    console.log('AuthController ~ signIn ~ body:', body);
    const data = await this.authService.signIn(body);
    return data;
  }

  @Get('log-out')
  async logout(@Request() req: RequestWithUser) {
    return await this.authService.logout(req.user._id.toString());
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const data = await this.authService.signUp(signUpDto);
    return data;
  }

  @Post('change-password')
  async changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const data = await this.authService.changePassword(
      req.user._id,
      changePasswordDto,
    );
    return data;
  }

  @Post('reset-password')
  @Public()
  async resetPassWord(@Body() body: Partial<User>) {
    const data = await this.authService.resetPassword(body);
    return data;
  }
}
