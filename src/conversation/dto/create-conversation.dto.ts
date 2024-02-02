import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateConversationDto {
  // @IsInt({ context: CONTEXT_VALIDATION.IS_NUMBER })

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'id của user muốn tạo cuộc trò truyện',
    example: 'ssssssss',
  })
  member_id: string;
}
