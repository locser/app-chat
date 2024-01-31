import { ApiProperty } from '@nestjs/swagger';
import { HandleMessageDto } from './message.dto';
import { IsNumberString } from 'class-validator';

export class HandleMessageRevokeDto extends HandleMessageDto {
  @IsNumberString({
    no_symbols: true,
  })
  @ApiProperty({
    type: String,
    required: false,
  })
  message_id: string;
}
