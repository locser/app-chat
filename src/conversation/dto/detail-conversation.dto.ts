import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DetailConversation {
  @ApiProperty({
    type: String,
    description: 'id của user muốn tạo cuộc trò truyện',
    example: 'ssssssss',
  })
  @IsString()
  @IsNotEmpty()
  conversation_id: string;
}
