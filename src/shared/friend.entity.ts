import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { BaseModel } from './base-model.entity';

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
    type: String,
  })
  user_id: string;

  @Prop({
    type: String,
    ref: 'User',
  })
  user_friend_id: string;

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
