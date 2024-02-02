import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumberString, IsOptional, IsString, ValidateNested } from 'class-validator';
import { HandleMessageDto, MessageTagDto, MessageThumbnailDto } from './message.dto';

export class HandleMessageReplyDto extends HandleMessageDto {
  @IsNumberString({
    no_symbols: true,
  })
  @ApiProperty({
    type: String,
    isArray: true,
  })
  message_reply_id: string;

  @IsString()
  @ApiProperty({
    type: String,
  })
  message: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageTagDto)
  @ApiProperty({
    type: MessageTagDto,
    isArray: true,
  })
  tag: MessageTagDto[];

  @ApiProperty({
    type: MessageThumbnailDto,
  })
  thumb: MessageThumbnailDto;
}
