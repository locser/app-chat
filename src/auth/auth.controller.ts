import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/enum';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RequestWithUser } from './dto/requests.type';
import { LoginDto } from './dto/user-sign-in.dto';
import { SignUpDto } from './dto/user-sign-up.dto';
import { Public, Roles } from './roles.decorator';

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
}
