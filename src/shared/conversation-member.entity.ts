import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'mongodb';
import { CONVERSATION_MEMBER_PERMISSION } from 'src/enum/conversation.enum';
import { BaseModel } from './base-model.entity';

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
    ref: 'User',
  })
  user_id: string;

  @Prop({
    type: Number,
  })
  permission: CONVERSATION_MEMBER_PERMISSION;

  @Prop({
    type: Timestamp,
    default: 0,
  })
  message_pre_id: number;

  @Prop({
    type: Timestamp,
    default: 0,
  })
  message_last_id: number;
}

export const ConversationMemberSchema =
  SchemaFactory.createForClass(ConversationMember);
