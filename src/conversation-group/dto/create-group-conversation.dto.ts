import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGroupConversationDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    isArray: true,
    description: 'id của user muốn tạo cuộc trò truyện',
    example: 'ssssssss',
  })
  member_id: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    description: 'tên của cuộc trò chuyện',
    example: 'ssssssss',
  })
  name: string;
}
