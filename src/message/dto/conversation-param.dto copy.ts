import { ApiProperty } from '@nestjs/swagger';

export class MessageParamsDto {
  @ApiProperty({
    type: String,
    description: 'Id của tin nhắn',
  })
  id: string;
}

export class MessagePinnedDeleteDto {
  @ApiProperty({
    type: String,
    description: 'Id của tin nhắn',
  })
  message_id: string;

  @ApiProperty({
    type: String,
    description: 'Id của cuộc trò chuyện',
  })
  conversation_id: string;
}
