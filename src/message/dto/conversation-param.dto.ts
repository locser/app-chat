import { ApiProperty } from '@nestjs/swagger';

export class ConversationParamsDto {
  @ApiProperty({
    type: String,
    description: 'Id của cuộc trò chuyện',
  })
  id: string;
}
