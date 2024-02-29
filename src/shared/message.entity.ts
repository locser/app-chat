import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
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
    ref: 'User',
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
    type: [String],
    nullable: true,
    default: [],
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
    ref: 'Message',
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

  // @Prop({
  //   nullable: true,
  //   default: [],
  //   type: Types.Array,
  // })
  // user_tag: any;

  @Prop({
    type: [
      {
        user_id: { type: String },
        type: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6] },
      },
    ],
  })
  reaction: { userId: string; type: number }[];

  @Prop({ type: [String], default: [], ref: 'User' })
  user_tag: string[];
}
export const MessageSchema = SchemaFactory.createForClass(Message);
