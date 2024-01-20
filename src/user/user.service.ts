import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RequestWithUser } from 'src/auth/dto/requests.type';
import { ExceptionResponse, User } from 'src/shared';
import { UserProfileResponse } from './response/user-profile.response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async updateUser(req: RequestWithUser, body: Partial<User>) {
    const { password, phone, status, role, ...updateData } = body;
    const userUpdated = await this.userModel.findOneAndUpdate(
      req.user._id,
      {
        ...updateData,
      },
      { new: true },
    );

    if (!userUpdated) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Update that bai');
    }
    return { userUpdated };
  }
  async getProfile(user_id: Types.ObjectId, target_id: Types.ObjectId) {
    const user = await this.userModel.findById(target_id);

    return new UserProfileResponse(user);
  }
}