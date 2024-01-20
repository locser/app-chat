import { BaseModel } from './base-model.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class CategorySticker extends BaseModel {
  @Prop({
    type: 'string',
    nullable: true,
  })
  owner_id: string;
}

export const CategoryStickerSchema =
  SchemaFactory.createForClass(CategorySticker);
