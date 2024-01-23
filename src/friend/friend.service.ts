import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExceptionResponse, User } from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { Block } from 'src/shared/block.entity';
import { Friend } from 'src/shared/friend.entity';
import { FriendWithQueryDto } from './dto/friend-with-query.dto';
import { RequestFriendWithQueryDto } from './dto/request-friend-with-query.dto';
import { ContactResponse, SyncFriendDto } from './dto/sync-friend.dto';
import { FriendResponse } from './response/friend.response';

@Injectable()
export class FriendService {
  countFriendRequests(_id: Types.ObjectId) {
    throw new Error('Method not implemented.');
  }
  removeRequestFriend(_id: Types.ObjectId, id: string) {
    throw new Error('Method not implemented.');
  }
  deniedFriendRequest(_id: Types.ObjectId, id: string) {
    throw new Error('Method not implemented.');
  }
  acceptFriendRequest(_id: Types.ObjectId, id: string) {
    throw new Error('Method not implemented.');
  }
  sendFriendRequestQRcode(_id: Types.ObjectId, id: string) {
    throw new Error('Method not implemented.');
  }
  sendFriendRequest(_id: Types.ObjectId, id: string) {
    throw new Error('Method not implemented.');
  }
  getSendRequestFriend(_id: Types.ObjectId, query: RequestFriendWithQueryDto) {
    throw new Error('Method not implemented.');
  }
  getRequestFriend(_id: Types.ObjectId, query: RequestFriendWithQueryDto) {
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

  async syncPhone(user_id: Types.ObjectId, syncFriendDto: SyncFriendDto) {
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
  }

  async removeFriend(user_id: Types.ObjectId, target_user_id: Types.ObjectId) {
    if (user_id === target_user_id)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Bạn không thể remove chính mình!',
      );

    const targetUser = await this.userModel.exists({ _id: target_user_id });

    if (!targetUser) {
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        'Người dùng không tồn tại!',
      );
    }

    // Kiểm tra block

    const hasBlock = await this.blockModel.exists([
      { user_id: user_id, user_block_id: target_user_id },
      { user_id: target_user_id, user_block_id: user_id },
    ]);

    if (hasBlock) {
      throw new ExceptionResponse(HttpStatus.BAD_REQUEST, 'Blocked');
    }

    await this.removeFriendUser(user_id, target_user_id);
    await this.removeFriendUser(target_user_id, user_id);

    return new BaseResponse(200, 'OK', null);
  }

  async getFriend(currentUserId: Types.ObjectId, query: FriendWithQueryDto) {
    try {
      // kiểm tra xem targetUser có phải mình không?

      // const friendListsss = await this.friendModel.create(
      //   {
      //     user_id: currentUserId,
      //     user_friend_id: currentUserId,
      //     type: 4,
      //   },
      //   {
      //     user_id: currentUserId,
      //     user_friend_id: currentUserId,
      //     type: 4,
      //   },
      // );

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

  async removeFriendUser(
    user_id: Types.ObjectId,
    target_user_id: Types.ObjectId,
  ) {
    return await this.friendModel.deleteOne({
      user_id: user_id,
      user_friend_id: target_user_id,
    });
  }
}
