import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base-model.entity';
import { CONVERSATION_MEMBER_PERMISSION } from 'src/enum/conversation.enum';
import { Types } from 'mongoose';
import { User } from './user.entity';
import * as mongoose from 'mongoose';
import { UserResponse } from 'src/conversation/response/user.response';
import { Timestamp } from 'mongodb';

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
    type: Types.ObjectId,
  })
  conversation_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  user_id: Types.ObjectId;

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
