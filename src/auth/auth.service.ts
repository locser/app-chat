import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { USER_STATUS } from 'src/enum';
import { ExceptionResponse, User } from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { LoginDto } from './dto/user-sign-in.dto';
import { SignUpDto } from './dto/user-sign-up.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(body: LoginDto) {
    const hasUser = await this.getAuthenticatedUser(
      {
        phone: body.phone,
        status: USER_STATUS.ACTIVE,
      },
      body.password,
    );

    const payload = {
      _id: hasUser._id,
      role: hasUser.role,
      full_name: hasUser.full_name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return new BaseResponse(200, 'OK', {
      _id: hasUser._id,
      full_name: hasUser.full_name,
      access_token: access_token,
    });
  }

  async getAuthenticatedUser1(phone: string, password: string): Promise<User> {
    try {
      // get user
      const user = await this.userModel.findOne({
        phone: phone,
        status: USER_STATUS.ACTIVE,
      });

      if (!user) {
        throw new ExceptionResponse(404, 'Wrong credentials!!');
      }
      // check password
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new ExceptionResponse(404, 'Wrong credentials!!');
    }
  }

  private async verifyPlainContentWithHashedContent(
    plainText: string,
    hashedText: string,
  ) {
    const is_matching = await bcrypt.compare(plainText, hashedText);
    if (!is_matching) {
      throw new ExceptionResponse(404, 'Wrong credentials!!');
    }
  }

  async logout(user_id: string) {
    return user_id;
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.userModel.findOne({ phone: signUpDto.phone });

      if (user) {
        throw new ExceptionResponse(400, 'Số điện thoại đã được sử dụng');
      }

      const hashedPassword = await bcrypt.hash(signUpDto.password, 5);

      const newUser = await this.userModel.create({
        full_name: signUpDto.full_name,
        nick_name: signUpDto.nick_name,
        phone: signUpDto.phone,
        password: hashedPassword,
      }); // TODO: Generate a JWT and return it here
      // instead of the user object
      return new BaseResponse(200, 'OK', newUser);
    } catch (error) {
      console.log('AuthService ~ signUp ~ error:', error);
      throw new ExceptionResponse(400, 'ERROR', error);
    }
  }

  async changePassword(
    _id: Types.ObjectId,
    changePasswordDto: ChangePasswordDto,
  ) {
    const { old_password, new_password } = changePasswordDto;

    if (old_password == new_password) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Mật khẩu mới không được trùng mật khẩu cũ',
      );
    }

    const hasAccess = await this.getAuthenticatedUser(
      { _id: _id },
      old_password,
    );

    if (hasAccess) {
      const userUpdated = await this.userModel.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          password: await bcrypt.hash(changePasswordDto.new_password, 5),
        },
      );

      return userUpdated;
    }
  }

  async getAuthenticatedUser(filter: object, password: string): Promise<User> {
    try {
      // get user
      const user = await this.userModel.findOne(filter);

      if (!user) {
        throw new ExceptionResponse(404, 'Wrong credentials!!');
      }
      // check password
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new ExceptionResponse(404, 'Wrong credentials!!');
    }
  }
}
