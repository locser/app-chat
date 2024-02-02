import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FRIEND_TYPE, USER_STATUS } from 'src/enum';
import { ExceptionResponse, User } from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { Block } from 'src/shared/block.entity';
import { Friend } from 'src/shared/friend.entity';
import { FriendWithQueryDto } from './dto/friend-with-query.dto';
import { ContactResponse, SyncFriendDto } from './dto/sync-friend.dto';
import { FriendResponse } from './response/friend.response';

@Injectable()
export class FriendService {
  countFriendRequests(user_id: string) {
    throw new Error('Method not implemented.');
  }
  removeRequestFriend(user_id: string, targetuser_id: string) {
    throw new Error('Method not implemented.');
  }
  deniedFriendRequest(user_id: string, targetuser_id: string) {
    throw new Error('Method not implemented.');
  }

  sendFriendRequestQRcode(user_id: string, targetuser_id: string) {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Friend.name)
    private readonly friendModel: Model<Friend>,

    @InjectModel(Block.name)
    private readonly blockModel: Model<Block>,
  ) {}

  async sendFriendRequest(user_id: string, target_id: string) {
    if (user_id == target_id)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Không thể tự gửi lời mời kết bạn đến chính mình',
      );

    const existUser = await this.userModel.findOne({
      _id: target_id,
      status: USER_STATUS.ACTIVE,
    });

    // báo lỗi khi người dùng không tồn tại, không active
    if (!existUser) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        '#01-sendFriendRequest: Người dùng này không tồn tại',
      );
    }

    const hasBlock = await this.checkBlockedUsers(user_id, target_id);
    if (hasBlock) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Nguời dùng này đã chặn bạn',
      );
    }

    const checkFriendType = await this.friendModel.findOne({
      user_id: user_id,
      user_friend_id: target_id,
    });

    if (checkFriendType?.type == 3) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Nguời dùng đã nhận lời mời kết bạn của bạn rồi, hãy chờ họ phản hồi',
      );
    }

    if (checkFriendType?.type == 2) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Nguời dùng đã gửi lời mời kết bạn cho bạn rồi, hãy phản hồi nó',
      );
    }
    if (checkFriendType?.type == 4) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Hai người đã là bạn bè',
      );
    }

    const a = await this.friendModel.create(
      {
        user_id: user_id,
        user_friend_id: target_id,
        type: 3, // chowf phan hoi
      },
      {
        user_friend_id: user_id,
        user_id: target_id,
        type: 2, // chowf xac nhan
      },
    );
    console.log('FriendService ~ sendFriendRequest ~  a:', a);

    return new BaseResponse(200, 'OK', null);
  }

  async syncPhone(user_id: string, syncFriendDto: SyncFriendDto) {
    const listUserContact = syncFriendDto.contact.reduce(
      (listUser, contact) => {
        listUser[contact.phone] = contact.name;

        return listUser;
      },
      {},
    );
    const contacts: string[] = Object.keys(listUserContact);

    if (contacts.length == 0) {
      return new BaseResponse(
        200,
        'OK',
        new ContactResponse({
          total_record: 0,
          total_record_online: 0,
          list: [],
        }),
      );
    }

    const listBlockUser = await this.blockModel
      .find({ user_id: user_id })
      .then((data) => data.map((item) => item.user_block_id));

    const filter = {
      _id: { $nin: [...listBlockUser, user_id] },
      phone: { $in: contacts },
    };

    const listUser = await this.userModel.find(filter);

    const listUserId = listUser.map((item) => item._id);

    const checkFriendType = await this.friendModel.find({
      user_id: user_id,
      user_friend_id: { $in: listUserId },
      status: 1,
    });

    const data = listUser.map((user) => {
      return new FriendResponse({
        user_id: data?._id || '',
        ...data?.user_friend_id,
        contact_type: checkFriendType.find(
          (item) => item.user_friend_id == user._id,
        ),
        name_phone: listUserContact[user.phone] || '',
      });
    });
  }
  async acceptFriendRequest(user_id: string, target_id: string) {
    try {
      const friendType = await this.checkFriendType(
        user_id.toString(),
        target_id,
      );

      if (!friendType || !(friendType?.type == FRIEND_TYPE.WAITING_CONFIRM)) {
        throw new ExceptionResponse(
          400,
          'Người này chưa gửi lời mời kết bạn tới bạn!',
        );
      }

      await this.friendModel.updateMany(
        {
          $or: [
            {
              user_id: user_id,
              user_friend_id: target_id,
            },
            {
              user_id: target_id,
              user_friend_id: user_id,
            },
          ],
        },
        { type: FRIEND_TYPE.FRIEND },
      );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('FriendService ~ error:', error);
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async checkFriendType(user_id: string, target_id: string) {
    return await this.friendModel.findOne({
      user_id: user_id,
      user_friend_id: target_id,
    });
  }

  async removeFriend(user_id: string, target_id: string) {
    if (user_id === target_id)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Bạn không thể remove chính mình!',
      );

    const targetUser = await this.userModel.exists({ _id: target_id });

    if (!targetUser) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Người dùng không tồn tại!',
      );
    }

    // Kiểm tra block

    const hasBlock = await this.checkBlockedUsers(user_id, target_id);

    if (hasBlock) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Blocked');
    }

    await this.removeFriendUser(user_id, target_id);
    await this.removeFriendUser(target_id, user_id);

    return new BaseResponse(200, 'OK', null);
  }

  async getFriend(currentUserId: string, query: FriendWithQueryDto) {
    try {
      // kiểm tra xem targetUser có phải mình không?

      const { page = 1, limit = 20, type } = query;

      // lấy ra ds bạn bè , này chỉ là câu query thui

      const friendList = await this.friendModel
        .find({
          user_id: currentUserId,
          type: type,
        })
        .populate({
          path: 'user_friend_id',
          select:
            'user_id full_name avatar nick_name address phone gender status created_at', // Chọn các trường bạn muốn hiển thị
        })
        .select('_id created_at updated_at user_friend_id')
        .sort({ created_at: 'desc' })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const list = friendList.map((data) => {
        // const friend: any = data?.user_friend_id;

        return new FriendResponse({
          user_id: data?.user_friend_id._id || '',
          ...data?.user_friend_id,
          contact_type: type,
        });
      });

      return new BaseResponse(200, 'OK', list);
    } catch (error) {
      console.log('FriendService ~ getFriend ~ error:', error);
    }
  }

  async removeFriendUser(user_id: string, target_user_id: string) {
    return await this.friendModel.deleteOne({
      user_id: user_id,
      user_friend_id: target_user_id,
    });
  }

  async checkBlockedUsers(user_id: string, target_user_id: string) {
    const block1 = await this.blockModel.exists({
      user_id: user_id,
      user_block_id: target_user_id,
    });

    const block2 = await this.blockModel.exists({
      user_id: target_user_id,
      user_block_id: user_id,
    });

    return block1 && block2;
  }
}
