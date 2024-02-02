import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { MESSAGE_STATUS, MESSAGE_TYPE } from 'src/enum/message.enum';
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
// @Entity('message')
export class Message extends BaseModel {
  @Prop({
    type: 'string',
  })
  conversation_id: string;

  @Prop({
    type: 'string',
  })
  user_id: string;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    nullable: true,
  })
  user_target: any[];

  @Prop({
    type: 'string',
    nullable: true,
  })
  message: string;

  @Prop({
    type: 'string',
    nullable: true,
  })
  media: string[];

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    nullable: true,
  })
  sticker: any;

  @Prop({
    type: 'number',
    default: 0,
  })
  no_of_reaction: number;

  @Prop({
    type: 'string',
    nullable: true,
  })
  message_reply_id: string;

  @Prop({
    type: 'number',
  })
  type: MESSAGE_TYPE;

  @Prop({
    type: 'number',
    default: MESSAGE_STATUS.ACTIVE,
  })
  status: MESSAGE_STATUS;

  @Prop({
    nullable: true,
    default: [],
    type: Types.Array,
  })
  user_tag: any;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
