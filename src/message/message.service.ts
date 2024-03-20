import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CONVERSATION_STATUS } from 'src/enum';
import {
  BaseResponse,
  Conversation,
  ConversationMember,
  ExceptionResponse,
  Message,
  User,
} from 'src/shared';
import { formatUnixTimestamp } from 'src/util';
import { GetAllMessagesDto } from './dto/get-all-messages.dto';
import { ListMessageResponse } from './response/list-message.response';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,
  ) {}

  async getMessageList(
    user_id: string,
    conversation_id: string,
    query: GetAllMessagesDto,
  ) {
    const { limit = 20, position } = query;
    try {
      // const conversation = await this.checkConversationValid(conversation_id);
      const memberConversation = await this.conversationMemberModel.findOne({
        conversation_id: conversation_id,
        user_id: user_id,
      });
      // console.log(
      //   'MessageService ~ memberConversation:',
      //   memberConversation,
      //   this.conversationMemberModel
      //     .findOne({
      //       conversation_id: conversation_id,
      //       user_id: user_id,
      //     })
      //     .getQuery(),
      // );

      if (!memberConversation) {
        throw new ExceptionResponse(
          400,
          'Bạn không có quyền truy cập tài nguyên này',
        );
      }

      const querySearch = {
        conversation_id: conversation_id,
      };

      if (position) {
        querySearch['created_at'] = {
          $lt: +position,
          $gt: memberConversation.message_pre_id,
        };
      } else {
        querySearch['created_at'] = { $gt: memberConversation.message_pre_id };
      }

      const messageList = await this.messageModel
        .find(querySearch)
        .populate('user_id', { _id: 1, username: 1, avatar: 1, full_name: 1 })
        .sort({ created_at: 'desc' })
        .limit(+limit)
        .lean();

      // console.log(
      //   this.messageModel
      //     .find(querySearch)
      //     .populate('user_id', { _id: 1, username: 1, avatar: 1, full_name: 1 })
      //     .sort({ created_at: 'desc' })
      //     .limit(+limit)
      //     .getQuery(),
      // );

      // get user target, get reaction, get tag_user 1708252373707 1706868129092

      return new BaseResponse(
        200,
        'OK',
        messageList.map((item) => {
          console.log(
            'MessageService ~ item:',
            item._id,
            memberConversation.message_pre_id,
            item.created_at,
            position,
          );

          return new ListMessageResponse({
            user: item?.user_id,
            _id: item?._id,
            conversation_id: item?.conversation_id,
            user_target: item?.user_target,
            message: item?.message,
            media: item?.media,
            no_of_reaction: item?.no_of_reaction,
            type: item?.type,
            status: item?.status,
            user_tag: item?.user_tag,
            reaction: item?.reaction,
            created_at: formatUnixTimestamp(item?.created_at),
            updated_at: formatUnixTimestamp(item?.updated_at),
            position: item?.created_at.toString(),
          });
        }),
      );
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
