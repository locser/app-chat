import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  BOOLEAN,
  CONVERSATION_MEMBER_PERMISSION,
  CONVERSATION_TYPE,
  MESSAGE_TYPE,
  USER_STATUS,
} from 'src/enum';
import {
  Conversation,
  ConversationMember,
  ConversationMemberWaitingConfirm,
  ExceptionResponse,
  Message,
  User,
} from 'src/shared';
import { BaseResponse } from 'src/shared/base-response.response';
import { checkMongoId, generateRandomString } from 'src/util';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { UpdatePermissionConversation } from './dto/update-permission.dto';

@Injectable()
export class ConversationGroupService {
  async joinWithLink(link_join: string, user_id: string) {
    try {
      const conversation = await this.conversationModel.findOne({
        is_join_with_link: BOOLEAN.TRUE,
        link_join: link_join,
        type: CONVERSATION_TYPE.GROUP,
      });

      if (!conversation) {
        return new BaseResponse(404, 'Cuộc trò chuyện không tồn tại');
      }

      if (conversation?.members?.includes(user_id)) {
        return new BaseResponse(200, 'Bạn đã là thành viên của nhóm', {
          conversation_id: conversation._id.toString(),
        });
      }

      const hasWaitingConfirmMember =
        await this.conversationMemberWaitingModel.findOne({
          conversation_id: conversation._id.toString(),
          user_id: user_id,
        });

      if (hasWaitingConfirmMember) {
        return new BaseResponse(
          200,
          'Bạn đã có trong danh sách chờ của thành viên nhóm',
          {
            conversation_id: conversation._id.toString(),
          },
        );
      }

      if (conversation.is_confirm_new_member) {
        /**
         * cần phê duyệt
         */

        await this.conversationMemberWaitingModel.create({
          conversation_id: conversation._id.toString(),
          created_at: +moment(),
          updated_at: +moment(),
          user_id: user_id,
        });

        return new BaseResponse(
          200,
          'Bạn cần chờ phê duyệt để tham gia nhóm!',
          {
            conversation_id: conversation._id.toString(),
          },
        );
      } else {
        /**
         * không cần phê duyệt -> thành thẳng member
         */
        await this.conversationMemberModel.create({
          conversation_id: conversation._id.toString(),
          created_at: +moment(),
          updated_at: +moment(),
          user_id: +user_id,
          permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
          message_last_id: 0,
          message_pre_id: 0,
        });

        conversation.members.push(user_id);
        conversation.no_of_member += 1;

        conversation.save();

        return new BaseResponse(200, 'Tham gia nhóm thành công!', {
          conversation_id: conversation._id,
        });
      }

      /**
       * Tạo tin nhắn
       */

      return new BaseResponse(200, 'OK');
    } catch (error) {
      console.log('ConversationGroupService ~ joinWithLink ~ error:', error);
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

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  async updatePermissionConversation(
    conversation_id: string,
    body: UpdatePermissionConversation,
    user_id: string,
  ) {
    try {
      const member_id = body.user_id;
      const permission = body.permission;

      if (!checkMongoId(member_id)) {
        throw new ExceptionResponse(400, 'member_id không hợp lệ');
      }

      const member = await this.userModel.findOne({
        status: USER_STATUS.ACTIVE,
        _id: new Types.ObjectId(member_id),
      });

      if (!member) {
        throw new ExceptionResponse(404, 'Không tìm thấy user hợp lệ!');
      }

      const conversation = await this.getOneConversation(conversation_id);

      if (conversation.type !== CONVERSATION_TYPE.GROUP) {
        throw new ExceptionResponse(
          404,
          'Chỉ có thể sử dụng với cuộc trò chuyện nhóm!',
        );
      }

      if (
        !conversation?.members?.includes(user_id) ||
        !conversation?.members?.includes(member_id)
      ) {
        throw new ExceptionResponse(404, 'Có user không hợp lệ!');
      }

      if (conversation.owner_id !== user_id) {
        throw new ExceptionResponse(400, 'Bạn không có quyền sử dụng!');
      }

      if (permission == CONVERSATION_MEMBER_PERMISSION.OWNER) {
        await this.conversationMemberModel.updateOne(
          {
            user_id: user_id,
            conversation_id: conversation_id,
          },
          {
            permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
          },
        );

        await this.conversationModel.updateOne(
          { _id: conversation._id },
          { owner_id: member_id },
        );
      }

      await this.conversationMemberModel.updateOne(
        {
          user_id: member_id,
          conversation_id: conversation_id,
        },
        {
          permission: permission,
        },
      );

      return new BaseResponse(200, 'OK', { name: conversation.name });
    } catch (error) {
      console.log(
        'ConversationService ~ updatePermissionConversation ~ error:',
        error,
      );
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async createNewGroupConversation(
    user_id: string,
    createConversation: CreateGroupConversationDto,
  ) {
    const { name, member_ids } = createConversation;
    try {
      const member = await this.userModel.find({
        _id: { $in: member_ids.map((_id) => new Types.ObjectId(_id)) },
      });

      if (!(member?.length == member_ids.length)) {
        throw new ExceptionResponse(400, 'Có user không tồn tại');
      }

      const newConversation = await this.conversationModel.create({
        name: name,
        owner_id: user_id,
        members: [user_id, ...member_ids],
        type: CONVERSATION_TYPE.GROUP,
        no_of_member: member_ids.length + 1,
      });

      //tạo member

      await this.conversationMemberModel.create({
        user_id: user_id,
        permission: CONVERSATION_MEMBER_PERMISSION.OWNER,
        conversation_id: newConversation._id.toString(),
      });

      await this.conversationMemberModel.create(
        member_ids.map((id) => {
          return {
            user_id: id,
            permission: CONVERSATION_MEMBER_PERMISSION.MEMBER,
            conversation_id: newConversation._id.toString(),
          };
        }),
      );

      // tạo tin nhắn chào mừng - hiện tại chưa được tạo bừa cái message text
      const firstMessage = await this.messageModel.create({
        user_id: user_id,
        conversation_id: newConversation._id.toString(),
        message: 'Xin chào cuộc trò chuyện nhóm mới',
        type: MESSAGE_TYPE.TEXT,
      });

      await this.conversationModel.updateOne(
        {
          _id: newConversation.id,
        },
        {
          last_message_id: firstMessage._id.toString(),
          last_activity: +moment(),
          updated_at: +moment(),
        },
      );

      return new BaseResponse(201, 'OK', {
        conversation_id: newConversation._id,
      });
    } catch (error) {
      console.log('ConversationGroupService ~ error:', error);
      return new BaseResponse(400, 'FAIL', error);
    }
  }

  async isJoinWithLink(conversation_id: string, user_id: string) {
    try {
      const conversation = await this.getOneConversation(conversation_id);

      if (
        !conversation?.members?.includes(user_id) ||
        conversation.type != CONVERSATION_TYPE.GROUP
      ) {
        throw new ExceptionResponse(400, 'Không tìm thấy cuộc trò chuyện');
      }

      conversation.is_join_with_link =
        conversation.is_join_with_link == BOOLEAN.TRUE
          ? BOOLEAN.FALSE
          : BOOLEAN.TRUE;

      if (conversation.is_join_with_link == BOOLEAN.FALSE)
        conversation.link_join = '';
      else conversation.link_join = generateRandomString(10);

      conversation.save();

      return new BaseResponse(200, 'OK', { link_join: conversation.link_join });
    } catch (error) {
      console.log('ConversationGroupService ~ isJoinWithLink ~ error:', error);
      throw new ExceptionResponse(400, 'FAILED', error);
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
}
