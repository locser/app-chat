import { HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { CreateConversationDto } from './dto/create-conversation.dto';
import {
  Conversation,
  ConversationMember,
  ConversationMemberWaitingConfirm,
  ExceptionResponse,
  User,
} from 'src/shared';
import { InjectModel } from '@nestjs/mongoose';
import {
  CONVERSATION_TYPE,
  CONVERSATION_STATUS,
  CONVERSATION_MEMBER_PERMISSION,
  USER_STATUS,
} from 'src/enum';
import { BaseResponse } from 'src/shared/base-response.response';
import { DetailConversation } from './dto/detail-conversation.dto';
import { DetailConversationResponse } from './response/detail-conversation.response';
import { QueryConversation } from './response/query-conversation.dto';

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

  async getListConversation(user_id: string, query_param: QueryConversation) {
    const { limit, position } = query_param;

    try {
      const query = {
        members: { $in: [user_id] },
        last_message_id: { $ne: '' },
        status: CONVERSATION_STATUS.ACTIVE,
      };

      if (position) {
        query['updated_at'] = { $lt: position };
      }

      const conversations = await this.conversationModel
        .find(query)
        .sort({ updated_at: 'desc' })
        .limit(+limit);

      return new BaseResponse(200, 'OK', conversations);
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
