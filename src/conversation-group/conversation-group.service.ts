import { Injectable } from '@nestjs/common';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { Model } from 'mongoose';
import {
  User,
  Conversation,
  ConversationMember,
  ConversationMemberWaitingConfirm,
} from 'src/shared';
import { InjectModel } from '@nestjs/mongoose';

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
  ) {}

  async createNewGroupConversation(
    user_id: string,
    createConversation: CreateGroupConversationDto,
  ) {
    try {
    } catch (error) {
      console.log('ConversationGroupService ~ error:', error);
    }
  }
}
