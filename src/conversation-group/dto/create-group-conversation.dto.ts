import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty } from 'class-validator';

export class CreateGroupConversationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'id của user muốn tạo cuộc trò truyện',
    example: 'ssssssss',
  })
  @ArrayMinSize(2, { message: 'Cuộc trò chuyện nhóm cần ít nhất 3 thành viên' })
  member_ids: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'tên của cuộc trò chuyện',
    example: 'ssssssss',
  })
  name: string;
}
