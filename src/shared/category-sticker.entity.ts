import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity('category_sticker')
export class CategoryStickerEntity extends BaseModel {
  @Column({
    type: 'bigint',
    nullable: true,
  })
  owner_id: string;
}
