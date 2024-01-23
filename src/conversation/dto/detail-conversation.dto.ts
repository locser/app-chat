import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class DetailConversation {
  // @IsInt({ context: CONTEXT_VALIDATION.IS_NUMBER })

  @IsNotEmpty()
  @ApiProperty({
    type: Types.ObjectId,
    description: 'id của user muốn tạo cuộc trò truyện',
    example: 'ssssssss',
  })
  conversation_id: string;
}
