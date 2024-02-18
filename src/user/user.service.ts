import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExceptionResponse, User } from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { RequestWithUser } from 'src/shared/requests.type';
import { UserProfileResponse } from './response/user-profile.response';

@Injectable()
export class UserService {
  async findUserByPhone(user_id: string, phone: string) {
    const user = await this.userModel.findOne({
      phone: phone,
    });

    if (!user) {
      throw new ExceptionResponse(404, 'Không tìm thấy user');
    }

    return new BaseResponse(200, 'OK', { user: new UserProfileResponse(user) });
  }
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async updateUser(req: RequestWithUser, body: Partial<User>) {
    const { password, phone, status, role, ...updateData } = body;

    const userUpdated = await this.userModel.findOneAndUpdate(
      { _id: req.user._id },
      { ...updateData },
      { new: true },
    );

    if (!userUpdated) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Update that bai');
    }

    return {
      status: 200,
      message: 'OK',
      data: userUpdated,
    };
  }

  async getProfile(user_id: string, target_id: string) {
    const user = await this.userModel
      .findById(target_id)
      .select({ password: 0 });

    if (!user) {
      throw new ExceptionResponse(HttpStatus.NOT_FOUND, 'User không tồn tại');
    }

    return {
      status: 200,
      message: 'OK',
      data: new UserProfileResponse(user),
    };
  }
}
