import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetAllMessagesPinnedDto {
  @ApiPropertyOptional({
    type: Number,
    example: 5,
  })
  limit: number;

  @ApiPropertyOptional({
    type: String,
    description: 'Vi tri cua message theo truong message_id',
    example: '3027',
  })
  position: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '18',
  })
  conversation_id: string;

  @ApiPropertyOptional({
    type: Number,
    description: '(1) - Đang ghim (Bao gồm tin nhắn thường + tin nhắn vote), (-1) - Tất cả (Chỉ có tin nhắn thường)',
    example: 1,
  })
  type: number;
}
