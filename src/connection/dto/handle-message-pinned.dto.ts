import { ApiProperty } from '@nestjs/swagger';
import { HandleMessageDto } from './message.dto';

export class HandleMessagePinnedDto extends HandleMessageDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  message_id: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  message_vote_id: string;
}
