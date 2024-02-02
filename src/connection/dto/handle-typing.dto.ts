import { ApiProperty } from '@nestjs/swagger';

export class HandleTypingDto {
  @ApiProperty({
    type: String,
  })
  conversation_id: string;
}
