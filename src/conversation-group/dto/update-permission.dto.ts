import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import { CONVERSATION_MEMBER_PERMISSION } from 'src/enum';

export class UpdatePermissionConversation {
  @IsNotEmpty()
  @IsMongoId()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  permission: CONVERSATION_MEMBER_PERMISSION;
}
