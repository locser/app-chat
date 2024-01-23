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
    type: Types.ObjectId,
    ref: 'User',
  })
  user_id: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  user_block_id: string;

  @Prop({
    type: Number,
  })
  type: number;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
