import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { HandleMessageDto, MessageTagDto, MessageThumbnailDto } from './message.dto';

export class HandleMessageTextDto extends HandleMessageDto {
  @IsString()
  @Length(1, 2000, { message: 'message chỉ được phép truyền 10000 ký tự' })
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
