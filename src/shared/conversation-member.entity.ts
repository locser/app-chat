import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { CONVERSATION_MEMBER_PERMISSION } from 'src/enum/conversation.enum';

@Entity('conversation_member')
export class ConversationMemberEntity extends BaseModel {
  @Column({
    type: 'bigint',
  })
  conversation_id: string;

  @Column({
    type: 'bigint',
  })
  user_id: string;

  @Column({
    type: 'smallint',
  })
  permission: CONVERSATION_MEMBER_PERMISSION;

  @Column({
    type: 'bigint',
    default: 0,
  })
  message_pre_id: string;

  @Column({
    type: 'bigint',
    default: 0,
  })
  message_last_id: string;
}
