import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base-model.entity';
import { CONVERSATION_MEMBER_PERMISSION } from 'src/enum/conversation.enum';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    // getters: true,
    // virtuals: true,
  },
})
// @Entity('conversation_member')
export class ConversationMember extends BaseModel {
  @Prop({
    type: String,
  })
  conversation_id: string;

  @Prop({
    type: String,
  })
  user_id: string;

  @Prop({
    type: Number,
  })
  permission: CONVERSATION_MEMBER_PERMISSION;

  @Prop({
    type: String,
    default: 0,
  })
  message_pre_id: string;

  @Prop({
    type: String,
    default: 0,
  })
  message_last_id: string;
}

export const ConversationMemberSchema =
  SchemaFactory.createForClass(ConversationMember);
