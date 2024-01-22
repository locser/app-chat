import { BaseModel } from './base-model.entity';
import {
  CONVERSATION_STATUS,
  CONVERSATION_TYPE,
} from 'src/enum/conversation.enum';
import { BOOLEAN } from 'src/enum/common.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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
// @Entity('conversation')
export class Conversation extends BaseModel {
  @Prop({
    type: 'string',
    nullable: true,
  })
  name: string;

  // @Prop({
  //   type: 'json',
  //   nullable: true,
  // })
  // avatar: any;

  @Prop({
    type: 'string',
    nullable: true,
  })
  avatar: string;

  @Prop({
    type: 'number',
  })
  type: CONVERSATION_TYPE;

  @Prop({
    array: true,
  })
  members: Types.ObjectId[];

  @Prop({
    type: 'string',
    nullable: true,
  })
  background: string;

  @Prop({
    type: 'number',
  })
  no_of_member: number;

  @Prop({
    type: 'string',
    nullable: true,
  })
  link_join: string;

  @Prop({
    type: 'number',
    default: BOOLEAN.FALSE,
  })
  is_confirm_new_member: BOOLEAN;

  @Prop({
    type: 'number',
    default: BOOLEAN.TRUE,
  })
  is_join_with_link: BOOLEAN;

  @Prop({
    type: 'number',
    default: BOOLEAN.TRUE,
  })
  is_send_message: BOOLEAN;

  @Prop({
    type: 'string',
    nullable: true,
  })
  last_message_id: string;

  @Prop({
    type: 'number',
    nullable: true,
  })
  last_activity: number;

  @Prop({
    type: 'number',
    default: CONVERSATION_STATUS.ACTIVE,
  })
  status: CONVERSATION_STATUS;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
