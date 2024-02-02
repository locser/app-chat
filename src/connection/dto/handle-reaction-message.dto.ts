import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class HandleReactionMessageDto {
  @IsNumberString()
  @ApiProperty({
    type: String,
  })
  message_id: string;
}
