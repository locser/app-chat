import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
// @Entity('conversation_member_waiting_confirm')
export class ConversationMemberWaitingConfirm extends BaseModel {
  @Prop({
    type: 'string',
  })
  conversation_id: string;

  @Prop({
    type: 'string',
  })
  user_id: string;
}

export const ConversationMemberWaitingConfirmSchema =
  SchemaFactory.createForClass(ConversationMemberWaitingConfirm);
