import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseModel } from './base-model.entity';
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
export class Block extends BaseModel {
  @Prop({
    type: String,
    ref: 'User',
  })
  user_id: Types.ObjectId;

  @Prop({
    type: String,
    ref: 'User',
  })
  user_block_id: Types.ObjectId;

  @Prop({
    type: Number,
  })
  type: number;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
