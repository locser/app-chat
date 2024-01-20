import { BaseModel } from './base-model.entity';
import { USER_STATUS } from '../enum/user.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
export class User extends BaseModel {
  @Prop({
    type: 'string',
    nullable: true,
  })
  avatar: string;

  @Prop({
    type: 'string',
  })
  full_name: string;

  @Prop({
    type: 'string',
    nullable: true,
  })
  nick_name: string;

  @Prop({
    type: 'string',
    nullable: true,
  })
  address: string;

  // @Prop({
  //   type: 'number',
  //   nullable: true,
  // })
  // lat: number;

  // @Prop({
  //   type: 'number',
  //   nullable: true,
  // })
  // lng: number;

  // @Prop({
  //   type: 'int',
  //   default: 0,
  // })
  // no_of_follow: number;

  @Prop({
    type: 'string',
    nullable: true,
  })
  cover: string;

  @Prop({
    type: 'string',
  })
  phone: string;

  @Prop({
    type: 'number',
    default: 0,
  })
  gender: number;

  @Prop({
    type: 'string',
    nullable: true,
  })
  birthday: string;

  @Prop({
    type: 'string',
    nullable: true,
  })
  description: string;

  @Prop({
    type: 'string',
    nullable: true,
  })
  email: string;

  // @Prop({
  //   type: 'number',
  //   default: BOOLEAN.FALSE,
  // })
  // is_enable_birthday: BOOLEAN;

  // @Prop({
  //   type: 'number',
  //   default: BOOLEAN.FALSE,
  // })
  // is_enable_phone: BOOLEAN;

  // @Prop({
  //   type: 'number',
  //   default: BOOLEAN.FALSE,
  // })
  // is_enable_email: BOOLEAN;

  @Prop({
    type: Timestamp,
    nullable: true,
  })
  last_connect: Date;

  @Prop({
    type: 'number',
    default: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS;
}

export const UserSchema = SchemaFactory.createForClass(User);
