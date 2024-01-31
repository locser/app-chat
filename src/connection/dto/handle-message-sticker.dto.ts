import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';
import { HandleMessageDto } from './message.dto';

export class HandleMessageStickerDto extends HandleMessageDto {
  @IsNumberString()
  @ApiProperty({
    type: Number,
  })
  sticker_id: string;
}
