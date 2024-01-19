import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';

@Entity('conversation_member_waiting_confirm')
export class ConversationMemberWaitingConfirmEntity extends BaseModel {
  @Column({
    type: 'bigint',
  })
  conversation_id: string;

  @Column({
    type: 'bigint',
  })
  user_id: string;
}
