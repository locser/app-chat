import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationMember } from 'src/shared';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectModel(ConversationMember.name)
    private readonly conversationMemberModel: Model<ConversationMember>,

    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<Conversation>,
  ) {}

  async beforeJoinRoom(
    user_id: Types.ObjectId,
    conversation_id: Types.ObjectId,
  ) {
    const hasAccess = await this.conversationMemberModel.findOne({
      user_id: user_id,
      conversation_id: conversation_id,
    });
    return !!hasAccess;
  }
}
