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

@Injectable()
export class ConversationService {
  private async getOneConversation(conversation_id: string) {
    if (!checkMongoId(conversation_id)) {
      throw new ExceptionResponse(400, 'Conversation_id không hợp lệ');
    }

    return await this.conversationModel.findById({
      _id: new Types.ObjectId(conversation_id),
    });
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
          message_pre_id: conversation.last_activity,
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
    return await this.messageModel.find({
      _id: { $in: list_message_id },
    });
  }

  async getListConversation(user_id: string, query_param: QueryConversation) {
    const { limit, position } = query_param;

    try {
      const listConversationHidden =
        await this.getListConversationHidden(user_id);

      const listConversationHiddenIds = listConversationHidden.map(
        (item) => item._id,
      );

      const query = {
        members: { $in: [user_id] },
        last_message_id: { $ne: '' },
        status: CONVERSATION_STATUS.ACTIVE,
        _id: { $nin: listConversationHiddenIds },
      };

      if (position) {
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
        listUserIds.push(...item.members);
        listMessageIds.push(new Types.ObjectId(item.last_message_id));
        listConversationIds.push(item._id.toString());
      });

      // get member info

      const listMember: { [user_id: string]: User } = await this.userModel
        .find(
          { _id: { $in: listUserIds } },
          { _id: true, full_name: true, avatar: true, status: true },
        )
        .then((data) => {
          return data.reduce((map, current) => {
            map[current._id.toString()] = current;
            return map;
          }, {});
        });

      // get last message info

      const listMessage = await this.getListLastMessageConversation(
        listMessageIds,
      ).then((data) => {
        return data.reduce((map, current) => {
          map[current._id.toString()] = current;
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

          item.avatar = otherUser.avatar;
          item.name = otherUser.full_name;
        }

        return {
          ...item,
          _id: id,
          is_notify: listConversationDisableNotify.find(
            (temp) => temp.conversation_id == id,
          )
            ? 0
            : 1,
          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
          last_activity: formatUnixTimestamp(item.last_activity),
          last_message: { ...listMessage[item.last_message_id] },
        };
      });

      return new BaseResponse(200, 'OK', data);
    } catch (error) {
      console.log('ConversationService ~ getListConversation ~ error:', error);
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async detailConversation(user_id: string, body: DetailConversation) {
    const detail: any = await this.conversationModel.findById(
      body.conversation_id,
    );

    const member = await this.conversationMemberModel
      .find({ conversation_id: body.conversation_id })
      .populate('user_id', 'avatar full_name _id')
      .exec();

    if (detail.type == 2) {
      // const other = member.filter((item) => {
      //   return item.user_id._id != user_id;
      // });
      // detail.name = other[0].user_id.full_name;
      // detail.avatar = other[0].user_id.avatar;
    }
    const result = {
      ...detail,
      members: member.map((item) => {
        return item.user_id;
      }),
    };

    return new DetailConversationResponse(result);
  }
}
