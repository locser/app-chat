import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CONVERSATION_STATUS, MESSAGE_TYPE } from 'src/enum';
import {
  Conversation,
  ConversationMember,
  ExceptionResponse,
  Message,
  User,
} from 'src/shared';
import { MessageTextDto } from './dto/message-text.dto';
import * as moment from 'moment';

@Injectable()
export class ConnectionService {
  async handleMessage(user_id: string, data: MessageTextDto) {
    const { type, conversation_id } = data;

    if (!type)
      throw new ExceptionResponse(
        400,
        'Không thể gửi tin nhắn mà không có cuộc trò chuyện',
      );

    /** Kiểm tra conversation */

    const conversation = await this.checkValidConversation(
      user_id,
      conversation_id,
    );

    if (!conversation)
      throw new ExceptionResponse(
        400,
        'Không thể gửi tin nhắn vào cuộc trò chuyện',
      );

    /** Kiểm tra message */
    const newMessage = await this.validateMessage(
      user_id,
      MESSAGE_TYPE.TEXT,
      data,
    );

    await this.conversationModel.updateOne(
      {
        _id: conversation._id,
      },
      {
        last_message_id: newMessage._id.toString(),
      },
    );

    return { conversation: conversation, message: newMessage };
  }

  constructor(
    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,

    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,

    @InjectModel(User.name)
    private readonly userModel: Model<Message>,
  ) {}

  async checkValidConversation(
    user_id: string,
    conversation_id: string,
  ): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findOne({
        _id: conversation_id,
        status: CONVERSATION_STATUS.ACTIVE,
      })
      .lean();

    if (!conversation?.members?.includes(user_id)) {
      return null;
    }

    return conversation;
  }

  async beforeJoinRoom(user_id: string, conversation_id: string) {
    const hasAccess = await this.conversationMemberModel.findOne({
      user_id: user_id,
      conversation_id: conversation_id,
    });

    return !!hasAccess;
  }

  /** SUB FUNCTION */
  private async validateMessage(
    user_id: string,
    type: MESSAGE_TYPE,
    data?: any,
  ) {
    let newMessage;

    switch (type) {
      case MESSAGE_TYPE.TEXT: {
        newMessage = await this.validateTextMessage(user_id, data);
        break;
      }
    }

    return newMessage;
  }

  private async validateTextMessage(user_id: string, data: any) {
    const { conversation_id, message, message_reply_id, user_tags } = data;

    if (!conversation_id || !message?.trim()) {
      throw new ExceptionResponse(
        400,
        'message text không hợp lệ, không để trống conversation_id hoặc message',
      );
    }

    let listUserTagIds = [];
    let listUserTag = [];
    if (user_tags?.length > 0) {
      listUserTagIds = user_tags.map((tag) => tag._id);
      if (listUserTagIds.includes(user_id)) {
        throw new ExceptionResponse(400, 'Bạn không thể tag tên bản thân!!');
      }
      listUserTag = await this.userModel.find({ _id: { $in: listUserTagIds } });

      if (listUserTag.length !== listUserTagIds.length) {
        throw new ExceptionResponse(400, 'Có user không hợp lệ');
      }
    }

    if (message_reply_id) {
      await this.checkValidMessage(message_reply_id, conversation_id);
    }

    // tạo message:::
    const newMessage = await this.messageModel.create({
      type: MESSAGE_TYPE.TEXT,
      user_id: user_id,
      message: message,
      conversation_id: conversation_id,
      message_reply_id: message_reply_id,
      user_target: [],
      user_tag: listUserTag,
      created_at: +moment(),
      updated_at: +moment(),
    });

    return newMessage;
  }

  private async checkValidMessage(
    message_id: Types.ObjectId,
    conversation_id: Types.ObjectId,
  ) {
    const message = await this.messageModel.findOne({
      _id: message_id,
      conversation_id: conversation_id,
    });

    if (!message)
      throw new ExceptionResponse(400, 'Có message_reply không hợp lệ');

    return message;
  }
}
