import { ArrayMinSize, IsArray } from 'class-validator';

export class AddMemberConversationDto {
  @IsArray({ message: 'Truyền mảng string các user_id cần thêm vào nhóm' })
  @ArrayMinSize(1, { message: 'Ít nhất phải có 1 user_id cần thêm' })
  members: string[];
}
