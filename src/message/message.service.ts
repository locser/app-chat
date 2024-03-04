import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ExceptionResponse, Message, User } from 'src/shared';
import { GetAllMessagesDto } from './dto/get-all-messages.dto';
import { CONVERSATION_STATUS } from 'src/enum';
import { formatUnixTimestamp } from 'src/util';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async getMessageList(
    user_id: string,
    conversation_id: string,
    query: GetAllMessagesDto,
  ) {
    const { limit = 20, position } = query;
    try {
      const conversation = await this.checkConversationValid(conversation_id);

      if (!conversation?.members.includes(user_id)) {
        throw new ExceptionResponse(
          400,
          'Bạn không có quyền truy cập tài nguyên này',
        );
      }

      const querySearch = {
        conversation_id: conversation_id,
      };

      if (position) {
        querySearch['created_at'] = { $lt: position };
      }

      const messageList = await this.messageModel
        .find(querySearch)
        .populate('user_id', { _id: 1, username: 1, avatar: 1, full_name: 1 })
        .sort({ created_at: 'desc' })
        .limit(+limit)
        .lean();

      // get user target, get reaction, get tag_user

      return messageList.map((item) => {
        return {
          user: item.user_id,
          _id: item._id,
          conversation_id: item.conversation_id,
          user_target: item.user_target,
          message: item.message,
          no_of_reaction: item.no_of_reaction,
          type: item.type,
          status: item.status,
          user_tag: item.user_tag,
          reaction: item.reaction,
          created_at: formatUnixTimestamp(item.created_at),
          updated_at: formatUnixTimestamp(item.updated_at),
        };
      });
    } catch (error) {
      console.log('MessageService ~ error:', error);
    }
  }

  async checkConversationValid(conversation_id: string): Promise<Conversation> {
    return await this.conversationModel.findOne({
      _id: new Types.ObjectId(conversation_id),
      status: CONVERSATION_STATUS.ACTIVE,
    });
  }
}
