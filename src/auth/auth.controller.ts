import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestWithUser } from '../shared/requests.type';
import { LoginDto } from './dto/user-sign-in.dto';
import { SignUpDto } from './dto/user-sign-up.dto';
import { Public } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  async signIn(@Body() body: LoginDto) {
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
    @Param() changePasswordDto: ChangePasswordDto,
  ) {
    const data = await this.authService.changePassword(
      req.user._id,
      changePasswordDto,
    );
    return data;
  }
}
