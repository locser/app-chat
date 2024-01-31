import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RequestWithUser } from 'src/auth/dto/requests.type';
import { ExceptionResponse, User } from 'src/shared';
import { UserProfileResponse } from './response/user-profile.response';

@Injectable()
export class UserService {
  async findUserByPhone(_id: Types.ObjectId, phone: string) {
    const user = await this.userModel.findOne({
      phone: phone,
    });

    if (!user) {
      throw new ExceptionResponse(404, 'Không tìm thấy user');
    }

    return user;
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

  async getProfile(user_id: Types.ObjectId, target_id: Types.ObjectId) {
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
