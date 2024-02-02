import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import {
  CONVERSATION_MEMBER_PERMISSION,
  CONVERSATION_TYPE,
  MESSAGE_TYPE,
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
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';

@Injectable()
export class ConversationGroupService {
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
}
