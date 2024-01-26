import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsNotEmpty } from 'class-validator';

export class ShareMessageLinkDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Ghi chú của tin nhắn',
    example: 'Đây là ghi chú',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'ID của cuộc trò chuyện cần share',
    example: '941',
  })
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({
    type: Array,
    description: 'ID của conversation cần share',
    example: '[1000, 941]',
  })
  @IsNotEmpty({ message: 'conversation_ids không được để trống!' })
  @ArrayMinSize(1, { message: 'conversation_ids phải có ít nhất 1 cuộc trò chuyện' })
  @ArrayMaxSize(5, { message: 'conversation_ids không quá 5 cuộc trò chuyện' })
  conversation_ids: string[];

  @ApiProperty({
    type: String,
    description: 'Key của tin nhắn cần share',
    example: '12345',
  })
  @IsNotEmpty()
  key_error: string;
}
