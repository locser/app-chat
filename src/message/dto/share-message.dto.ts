import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class ShareMessageDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Ghi chú của tin nhắn',
    example: 'Đây là ghi chú',
  })
  message: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'ID của tin nhắn cần share',
    example: '12345',
  })
  message_share_id: string;

  @ApiProperty({
    type: Array,
    description: 'ID của conversation cần share',
    example: '[12345, 1234567]',
  })
  @IsNotEmpty({ message: 'conversation_ids không được để trống!' })
  @ArrayMinSize(1, { message: 'conversation_ids phải có ít nhất 1 cuộc trò chuyện' })
  @ArrayMaxSize(5, { message: 'conversation_ids không quá nhất 5 cuộc trò chuyện' })
  conversation_ids: string[];

  @ApiProperty({
    type: String,
    description: 'Key của tin nhắn cần share',
    example: '12345',
  })
  key_error: string;
}
