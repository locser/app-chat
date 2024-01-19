import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { MESSAGE_STATUS, MESSAGE_TYPE } from 'src/enum/message.enum';

@Entity('message')
export class MessageEntity extends BaseModel {
  @Column({
    type: 'bigint',
  })
  conversation_id: string;

  @Column({
    type: 'bigint',
  })
  user_id: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  user_target: any[];

  @Column({
    type: 'text',
    nullable: true,
  })
  message: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  media: string[];

  @Column({
    type: 'json',
    nullable: true,
  })
  sticker: any;

  @Column({
    type: 'int',
    default: 0,
  })
  no_of_reaction: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  message_reply_id: string;

  @Column({
    type: 'smallint',
  })
  type: MESSAGE_TYPE;

  @Column({
    type: 'smallint',
    default: MESSAGE_STATUS.ACTIVE,
  })
  status: MESSAGE_STATUS;
}
