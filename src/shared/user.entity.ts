import { BaseModel } from './base-model.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'mongodb';
import { Role, USER_STATUS } from 'src/enum';

@Schema({
  collection: 'users',
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
    default: '',
  })
  avatar: string;

  @Prop({
    type: 'string',
    default: '',
  })
  full_name: string;

  @Prop({
    type: 'string',
    nullable: true,
    default: '',
  })
  nick_name: string;

  @Prop({
    type: 'string',
    nullable: false,
    default: '',
  })
  password: string;

  @Prop({
    type: 'string',
    nullable: true,
    default: '',
  })
  address: string;

  @Prop({
    type: 'string',
    nullable: true,
    default: '',
  })
  cover: string;

  @Prop({
    type: 'string',
    default: '',
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
    default: '',
  })
  birthday: string;

  @Prop({
    type: 'string',
    nullable: true,
    default: '',
  })
  description: string;

  @Prop({
    type: 'string',
    nullable: true,
    default: '',
  })
  email: string;

  @Prop({
    type: Timestamp,
    nullable: true,
    default: '',
  })
  last_connect: number;

  @Prop({
    type: 'number',
    default: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS;

  @Prop({
    type: 'string',
    default: Role.User,
    enum: ['user', 'admin'],
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
