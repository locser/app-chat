import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  CONVERSATION_MEMBER_PERMISSION,
  CONVERSATION_STATUS,
  CONVERSATION_TYPE,
  USER_STATUS,
} from 'src/enum';
import {
  Conversation,
  ConversationHidden,
  ConversationMember,
  ConversationMemberWaitingConfirm,
  ConversationPinned,
  ExceptionResponse,
  Message,
  User,
} from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { ConversationDisableNotify } from 'src/shared/conversation-disable-notify.entity';
import { checkMongoId, formatUnixTimestamp } from 'src/util';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { DetailConversation } from './dto/detail-conversation.dto';
import { DetailConversationResponse } from './response/detail-conversation.response';
import { QueryConversation } from './response/query-conversation.dto';
import { LastMessageResponse } from './response/last-message.interface';
import { UserMessageResponse } from 'src/connection/response/user-message.response';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,

    @InjectModel(ConversationMemberWaitingConfirm.name)
    private readonly conversationMemberWaitingModel: Model<ConversationMemberWaitingConfirm>,

    @InjectModel(ConversationHidden.name)
    private readonly conversationHiddenModel: Model<ConversationHidden>,

    @InjectModel(ConversationPinned.name)
    private readonly conversationPinnedModel: Model<ConversationPinned>,

    @InjectModel(ConversationDisableNotify.name)
    private readonly conversationDisableNotifyModel: Model<ConversationDisableNotify>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  async createNewConversation(
    user_id: string,
    createConversation: CreateConversationDto,
  ) {
    const member_id: string = createConversation.member_id;
    if (user_id == member_id)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        ` Không thể tạo cuộc trò chuyện với chính mình`,
      );

    const member = await this.userModel.findOne({
      _id: member_id,
      status: USER_STATUS.ACTIVE,
    });

    if (!member)
      throw new ExceptionResponse(
        HttpStatus.BAD_REQUEST,
        ` Người dùng không tồn tại`,
      );

    const filter = {
      type: CONVERSATION_TYPE.PERSONAL,
      members: { $all: [user_id, member_id] },
    };

    let conversation = await this.conversationModel.findOne(filter).exec();

    if (conversation)
      return new BaseResponse(200, 'OK', { conversation_id: conversation.id });

    /** Tạo cuộc trò chuyện */
    conversation = await this.conversationModel.create({
      no_of_member: 2,
      type: CONVERSATION_TYPE.PERSONAL,
      status: CONVERSATION_STATUS.ACTIVE,
      last_activity: performance.timeOrigin + performance.now(),
      members: [user_id, member_id],
      is_join_with_link: 0,
    });

    /** Lưu member */
    await this.conversationMemberModel.create(
      {
        conversation_id: conversation.id,
        user_id: user_id,
        permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
        message_pre_id: 0,
        message_last_id: 0,
      },
      {
        conversation_id: conversation.id,
        user_id: member_id,
        permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
        message_pre_id: 0,
        message_last_id: 0,
      },
    );

    return new BaseResponse(201, 'OK', { conversation_id: conversation.id });
  }

  async getListConversationHidden(
    user_id: string,
  ): Promise<ConversationHidden[]> {
    return await this.conversationHiddenModel.find({
      user_id: user_id,
    });
  }

  async getListConversationPinned(
    user_id: string,
  ): Promise<ConversationPinned[]> {
    return await this.conversationPinnedModel.find({
      user_id: user_id,
    });
  }

  async getListConversationDisableNotify(
    user_id: string,
  ): Promise<ConversationDisableNotify[]> {
    return await this.conversationDisableNotifyModel.find({
      user_id: user_id,
    });
  }

  async getListLastMessageConversation(list_message_id): Promise<Message[]> {
    return await this.messageModel
      .find({
        _id: { $in: list_message_id },
      })
      .populate('user_id', { _id: 1, username: 1, avatar: 1, full_name: 1 })
      .lean();
  }

  async getListConversation1(user_id: string, query_param: QueryConversation) {
    const { limit = 20 } = query_param;
    console.log(
      'ConversationService ~ getListConversation1 ~ user_id:',
      user_id,
    );

    try {
      const conversations = await this.conversationModel
        .aggregate<Conversation>([
          // { $project: { conversationStrId: { $toString: '$_id' } } },
          {
            $lookup: {
              from: ConversationMember.name,
              let: {
                conversationId: '$conversation_id',
                last_activity: '$last_activity',
              }, // Define the variable here
              // localField: '_id',
              // foreignField: 'conversation_id',
              pipeline: [
                {
                  $addFields: { conversation_id: { $toString: '$_id' } },
                  // $addFields: { conversation_id: { $toString: '$_id' } },
                },
                {
                  $match: {
                    $expr: {
                      $and: [
                        {
                          $eq: [
                            '$conversation_member.conversation_id',
                            '$$conversationId',
                          ],
                        },
                        {
                          $lt: [
                            '$conversation_member.message_pre_id',
                            '$$last_activity',
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: 'conversation_member',
            },
          },
          {
            $match: {
              members: { $in: [user_id] },
              last_message_id: { $ne: '' },
              status: CONVERSATION_STATUS.ACTIVE,
              // 'conversation_member.user_id': user_id,
              // $expr: {
              //   $gt: ['$last_activity', '$conversation_member.message_pre_id'],
              // },
            },
          },
        ])
        .project({
          __v: false,
        })
        .limit(+limit)
        .sort({ updated_at: 'desc' })
        .exec(); // Fix: Use exec() instead of toArray()

      const conversationMember = await this.conversationMemberModel
        .find({
          user_id: user_id,
        })
        .lean();

      const mapConversationMember = conversationMember.reduce(
        (map, current) => {
          map[current.conversation_id] = current.updated_at;
          return map;
        },
        {},
      );

      console.log(
        'ConversationService ~ getListConversation1 ~ mapConversationMember:',
        conversations,
      );

      const listConversation = conversations.map((item) => {
        if (item.last_activity <= mapConversationMember[item._id.toString()]) {
          console.log('thawfng nay no xoa cuoc tro chuyen roi ne', item._id);
        }

        return item;
      });

      console.log(
        'ConversationService ~ getListConversation1 ~ conversations:',
        listConversation,
      );

      return listConversation;

      if (conversations.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      const listUserIds = [];
      const listMessageIds = [];
      const listConversationIds = [];

      conversations.map((item) => {
        if (item.type == CONVERSATION_TYPE.PERSONAL)
          listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: UserMessageResponse } =
        await this.userModel
          .find(
            { _id: { $in: listUserIds } },
            { _id: true, full_name: true, avatar: true, status: true },
          )
          .then((data) => {
            return data.reduce((map, current) => {
              map[current._id.toString()] = {
                _id: current._id.toString(),
                avatar: current.avatar,
                full_name: current.full_name,
              };
              return map;
            }, {});
          });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, message: any) => {
          map[message._id.toString()] = {
            ...message,
            user: new UserMessageResponse(message.user_id),
            updated_at: formatUnixTimestamp(message.updated_at),
            created_at: formatUnixTimestamp(message.created_at),
          };
          return map;
        }, {});
      });

      // get setting, pinned, notify, hidden
      // const listConversationPinned =
      //   await this.getListConversationPinned(user_id);

      const listConversationDisableNotify =
        await this.getListConversationDisableNotify(user_id);

      const data = conversations.map((item) => {
        const id = item._id.toString();

        if (item.type == CONVERSATION_TYPE.PERSONAL) {
          const otherUserId = item.members.find((_id) => _id != user_id);

          const otherUser = listMember[otherUserId];

          item.avatar = otherUser?.avatar || '';
          item.name = otherUser?.full_name || '';
        }

        return {
          ...item,
          _id: id,
          is_notify: listConversationDisableNotify.find(
            (temp) => temp.conversation_id == id,
          )
            ? 0
            : 1,
          is_pinned: 0,
          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
          last_activity: formatUnixTimestamp(item.last_activity),
          last_message: new LastMessageResponse({
            ...listMessage[item.last_message_id],
            _id: listMessage[item.last_message_id]._id.toString(),
          }),
        };
      });

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log('ConversationService ~ getListConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL', []);
    }
  }

  async getListConversation(user_id: string, query_param: QueryConversation) {
    const { limit = 20, position } = query_param;

    try {
      const listConversationHidden =
        await this.getListConversationHidden(user_id);

      const listConversationHiddenIds = listConversationHidden.map(
        (item) => new Types.ObjectId(item._id),
      );

      const query = {
        members: { $in: [user_id] },
        last_message_id: { $ne: '' },
        status: CONVERSATION_STATUS.ACTIVE,
        _id: { $nin: listConversationHiddenIds },
      };

      if (position?.length) {
        query['updated_at'] = { $lt: position };
      }

      const conversations = await this.conversationModel
        .find(query, {
          __v: false,
        })
        .sort({ updated_at: 'desc' })
        .limit(+limit)
        .lean();

      if (conversations.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      const listUserIds = [];
      const listMessageIds = [];
      const listConversationIds = [];

      conversations.map((item) => {
        if (item.type == CONVERSATION_TYPE.PERSONAL)
          listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: UserMessageResponse } =
        await this.userModel
          .find(
            { _id: { $in: listUserIds } },
            { _id: true, full_name: true, avatar: true, status: true },
          )
          .then((data) => {
            return data.reduce((map, current) => {
              map[current._id.toString()] = {
                _id: current._id.toString(),
                avatar: current.avatar,
                full_name: current.full_name,
              };
              return map;
            }, {});
          });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, message: any) => {
          map[message._id.toString()] = {
            ...message,
            user: new UserMessageResponse(message.user_id),
            updated_at: formatUnixTimestamp(message.updated_at),
            created_at: formatUnixTimestamp(message.created_at),
          };
          return map;
        }, {});
      });

      // get setting, pinned, notify, hidden
      // const listConversationPinned =
      //   await this.getListConversationPinned(user_id);

      const listConversationDisableNotify =
        await this.getListConversationDisableNotify(user_id);

      const data = conversations.map((item) => {
        const id = item._id.toString();

        if (item.type == CONVERSATION_TYPE.PERSONAL) {
          const otherUserId = item.members.find((_id) => _id != user_id);

          const otherUser = listMember[otherUserId];

          item.avatar = otherUser?.avatar || '';
          item.name = otherUser?.full_name || '';
        }

        return {
          ...item,
          _id: id,
          is_notify: listConversationDisableNotify.find(
            (temp) => temp.conversation_id == id,
          )
            ? 0
            : 1,
          is_pinned: 0,
          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
          last_activity: formatUnixTimestamp(item.last_activity),
          last_message: new LastMessageResponse({
            ...listMessage[item.last_message_id],
            _id: listMessage[item.last_message_id]._id.toString(),
          }),
        };
      });

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log('ConversationService ~ getListConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL', []);
    }
  }

  async detailConversation(user_id: string, body: DetailConversation) {
    try {
      const conversation: Conversation = await this.conversationModel
        .findById(body.conversation_id)
        .lean();

      if (!conversation)
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');

      const members: User[] = await this.userModel
        .find(
          {
            _id: {
              $in: conversation.members.map((item) => new Types.ObjectId(item)),
            },
          },
          {
            _id: true,
            full_name: true,
            avatar: true,
          },
        )
        .lean();

      const permission = await this.conversationMemberModel
        .findOne({
          conversation_id: body.conversation_id,
          user_id: user_id,
        })
        .lean();

      // const memberPermissions = await this.conversationMemberModel
      //   .find({
      //     conversation_id: body.conversation_id,
      //   })
      //   .lean();

      // const userPermissions = memberPermissions.reduce((map, current) => {
      //   map[current.user_id] = current?.permission || 0;
      //   return map;
      // }, {});

      if (conversation.type == 2) {
        const other = members.find((item) => {
          return item._id.toString() != user_id;
        });

        conversation.name = other?.full_name;
        conversation.avatar = other?.avatar;
      }
      const result = {
        ...conversation,
        my_permission: permission?.permission || 0,
        // members: members.map((item) => {
        //   return {
        //     ...item,
        //     _id: item._id.toString(),
        //     permission: userPermissions[item._id.toString()] || 0,
        //   };
        // }),
        // members: members.map((item) => {
        //   return item.user_id.toString();
        // }),
        created_at: formatUnixTimestamp(conversation.created_at),
        updated_at: formatUnixTimestamp(conversation.updated_at),
        last_activity: formatUnixTimestamp(conversation.last_activity),
      };

      return new BaseResponse(
        200,
        'OK',
        new DetailConversationResponse(result),
      );
    } catch (error) {
      console.log('ConversationService ~ detailConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL');
    }
  }

  async hiddenConversation(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const hasConversationHidden = await this.conversationHiddenModel.exists({
        user_id: user_id,
        conversation_id: conversation_id,
      });

      if (hasConversationHidden) {
        await this.conversationHiddenModel.deleteOne({
          user_id: user_id,
          conversation_id: conversation_id,
        });
      } else {
        await this.conversationHiddenModel.create({
          user_id: user_id,
          conversation_id: conversation_id,
          updated_at: +moment(),
          created_at: +moment(),
        });
      }

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ hiddenConversation ~ error:', error);
      throw new ExceptionResponse(400, 'FAILED', error);
    }
  }

  async deleteConversation(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      await this.conversationMemberModel.updateOne(
        {
          user_id: user_id,
          conversation_id: conversation_id,
        },
        {
          message_last_id: conversation.last_message_id,
          message_pre_id: conversation.last_message_id,
          updated_at: +moment(),
        },
      );

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ deleteConversation ~ error:', error);
      throw new ExceptionResponse(400, 'FAILED', error);
    }
  }

  async disableNotify(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const hasConversationHidden =
        await this.conversationDisableNotifyModel.exists({
          user_id: user_id,
          conversation_id: conversation_id,
        });

      if (hasConversationHidden) {
        await this.conversationDisableNotifyModel.deleteOne({
          user_id: user_id,
          conversation_id: conversation_id,
        });
      } else {
        await this.conversationDisableNotifyModel.create({
          user_id: user_id,
          conversation_id: conversation_id,
          updated_at: +moment(),
          created_at: +moment(),
        });
      }

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ disableNotify ~ error:', error);
      throw new ExceptionResponse(400, 'FAILED', error);
    }
  }

  async pinConversation(user_id: string, conversation_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      const hasConversationHidden = await this.conversationPinnedModel.exists({
        user_id: user_id,
        conversation_id: conversation_id,
      });

      if (hasConversationHidden) {
        await this.conversationPinnedModel.deleteOne({
          user_id: user_id,
          conversation_id: conversation_id,
        });
      } else {
        await this.conversationPinnedModel.create({
          user_id: user_id,
          conversation_id: conversation_id,
          updated_at: +moment(),
          created_at: +moment(),
        });
      }

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationService ~ pinConversation ~ error:', error);
      throw new ExceptionResponse(400, 'FAILED', error);
    }
  }

  async updateBackgroundConversation(
    conversation_id: string,
    back_ground: string,
    user_id: string,
  ) {
    try {
      if (!back_ground)
        throw new ExceptionResponse(400, 'Không thể đặt tên trống');
      const conversation = await this.getOneConversation(conversation_id);

      if (!conversation?.members?.includes(user_id)) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.background = back_ground;

      conversation.save();

      return new BaseResponse(200, 'OK', {
        back_ground: conversation.background,
      });
    } catch (error) {
      console.log(
        'ConversationService ~ updateBackgroundConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async settingConfirmMemberConversation(
    conversation_id: string,
    user_id: string,
  ) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation?.members?.includes(user_id) ||
        conversation.owner_id !== user_id
      ) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.is_confirm_new_member = +!conversation.is_confirm_new_member;

      conversation.save();

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log(
        'ConversationService ~ settingConfirmMemberConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async updateNameConversation(
    conversation_id: string,
    name: string,
    user_id: string,
  ) {
    try {
      if (!name) throw new ExceptionResponse(400, 'Không thể đặt tên trống');
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation?.members?.includes(user_id) ||
        conversation.type !== CONVERSATION_TYPE.GROUP
      ) {
        throw new ExceptionResponse(404, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.name = name;

      conversation.save();

      return new BaseResponse(200, 'OK', { name: conversation.name });
    } catch (error) {
      console.log(
        'ConversationService ~ updateNameConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  private async getOneConversation(conversation_id: string) {
    if (!checkMongoId(conversation_id)) {
      throw new ExceptionResponse(400, 'Conversation_id không hợp lệ');
    }

    return await this.conversationModel.findById({
      _id: new Types.ObjectId(conversation_id),
    });
  }

  async getListPinnedConversation(user_id: string) {
    try {
      const listConversationPinned =
        await this.getListConversationPinned(user_id);

      if (listConversationPinned.length == 0) {
        return new BaseResponse(200, 'OK', []);
      }

      const listConversationIds = listConversationPinned.map(
        (item) => item.conversation_id,
      );

      const conversations = await this.conversationModel
        .find({
          _id: { $in: listConversationIds },
        })
        .lean();

      const listUserIds = [];
      const listMessageIds = [];

      conversations.map((item) => {
        if (item.type == CONVERSATION_TYPE.PERSONAL)
          listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: UserMessageResponse } =
        await this.userModel
          .find(
            { _id: { $in: listUserIds } },
            { _id: true, full_name: true, avatar: true, status: true },
          )
          .then((data) => {
            return data.reduce((map, current) => {
              map[current._id.toString()] = {
                _id: current._id.toString(),
                avatar: current.avatar,
                full_name: current.full_name,
              };
              return map;
            }, {});
          });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, message: any) => {
          map[message._id.toString()] = {
            ...message,
            user: new UserMessageResponse(message.user_id),
            updated_at: formatUnixTimestamp(message.updated_at),
            created_at: formatUnixTimestamp(message.created_at),
          };
          return map;
        }, {});
      });

      const listConversationDisableNotify =
        await this.getListConversationDisableNotify(user_id);

      const data = conversations.map((item) => {
        const id = item._id.toString();

        if (item.type == CONVERSATION_TYPE.PERSONAL) {
          const otherUserId = item.members.find((_id) => _id != user_id);

          const otherUser = listMember[otherUserId];

          item.avatar = otherUser?.avatar || '';
          item.name = otherUser?.full_name || '';
        }

        return {
          ...item,
          _id: id,
          is_notify: listConversationDisableNotify.find(
            (temp) => temp.conversation_id == id,
          )
            ? 0
            : 1,
          is_pinned: 1,

          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
          last_activity: formatUnixTimestamp(item.last_activity),
          last_message: new LastMessageResponse({
            ...listMessage[item.last_message_id],
            _id: listMessage[item.last_message_id]._id.toString(),
          }),
        };
      });

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log(
        'ConversationService ~ getListPinnedConversation ~ error:',
        error,
      );
      throw new ExceptionResponse(error.status, error.message, error);
    }
  }
}
