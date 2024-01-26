import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, Message, User } from 'src/shared';
import { GetAllMessagesDto } from './dto/get-all-messages.dto';

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
    user_id: Types.ObjectId,
    conversation_id: string,
    query: GetAllMessagesDto,
  ) {
    return { user_id, conversation_id, query };
  }
}
