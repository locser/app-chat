import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';
import {
  CONVERSATION_STATUS,
  CONVERSATION_TYPE,
} from 'src/enum/conversation.enum';
import { BOOLEAN } from 'src/enum/common.enum';

@Entity('conversation')
export class ConversationEntity extends BaseModel {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  name: string;

  // @Column({
  //   type: 'json',
  //   nullable: true,
  // })
  // avatar: any;

  @Column({
    type: 'text',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'smallint',
  })
  type: CONVERSATION_TYPE;

  @Column({
    type: 'bigint',
    array: true,
  })
  members: string[];

  @Column({
    type: 'text',
    nullable: true,
  })
  background: string;

  @Column({
    type: 'smallint',
  })
  no_of_member: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  link_join: string;

  @Column({
    type: 'smallint',
    default: BOOLEAN.FALSE,
  })
  is_confirm_new_member: BOOLEAN;

  @Column({
    type: 'smallint',
    default: BOOLEAN.TRUE,
  })
  is_join_with_link: BOOLEAN;

  @Column({
    type: 'smallint',
    default: BOOLEAN.TRUE,
  })
  is_send_message: BOOLEAN;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  last_message_id: string;

  @Column({
    type: 'double precision',
    nullable: true,
  })
  last_activity: number;

  @Column({
    type: 'smallint',
    default: CONVERSATION_STATUS.ACTIVE,
  })
  status: CONVERSATION_STATUS;
}
