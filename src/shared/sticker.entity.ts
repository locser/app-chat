import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
// @Entity('sticker')
export class Sticker extends BaseModel {
  // @Prop({
  //   type: 'string',
  //   nullable: true,
  // })
  // category_sticker_id: string;

  @Prop({
    type: 'string',
  })
  media: string;

  @Prop({
    type: 'string',
    array: true,
  })
  tag: string[];
}

export const StickerSchema = SchemaFactory.createForClass(Sticker);
