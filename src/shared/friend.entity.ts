import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base-model.entity';
import { Types } from 'mongoose';
import * as moment from 'moment';

@Schema({
  collection: 'friends',
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    // getters: true,
    // virtuals: true,
  },
})
export class Friend extends BaseModel {
  @Prop({
    type: Types.ObjectId,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  user_friend_id: Types.ObjectId;

  @Prop({
    type: Number,
  })
  type: number;
}
const FriendSchema = SchemaFactory.createForClass(Friend);

FriendSchema.pre('save', function (next) {
  this.updated_at = +moment();
  next();
});

export { FriendSchema };
