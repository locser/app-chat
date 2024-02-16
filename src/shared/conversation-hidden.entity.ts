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
// @Entity('conversation_member')
export class ConversationHidden extends BaseModel {
  @Prop({
    type: String,
  })
  conversation_id: string;

  @Prop({
    type: String,
    ref: 'User',
  })
  user_id: string;
}

export const ConversationHiddenSchema =
  SchemaFactory.createForClass(ConversationHidden);
