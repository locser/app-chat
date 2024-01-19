import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity('sticker')
export class StickerEntity extends BaseModel {
  // @Column({
  //   type: 'bigint',
  //   nullable: true,
  // })
  // category_sticker_id: string;

  @Column({
    type: 'text',
  })
  media: string;

  @Column({
    type: 'varchar',
    array: true,
  })
  tag: string[];
}
