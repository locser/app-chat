import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNumberString } from 'class-validator';
import { HandleMessageDto, MessageTagDto } from './message.dto';

export class HandleMessageMediaDto extends HandleMessageDto {
  @ArrayMinSize(1)
  @IsNumberString({ no_symbols: true }, { each: true })
  @ApiProperty({
    type: MessageTagDto,
    isArray: true,
  })
  media: string[];
}
