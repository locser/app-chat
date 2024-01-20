import { BaseModel } from './base-model.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'mongodb';
import { Role, USER_STATUS } from 'src/enum';

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
    nullable: false,
  })
  password: string;

  @Prop({
    type: 'string',
    nullable: true,
  })
  address: string;

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

  @Prop({
    type: 'string',
    default: Role.User,
    enum: ['user', 'admin'],
  })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
