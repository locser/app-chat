import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class MessageTagDto {
  @IsInt()
  @ApiProperty({
    type: Number,
  })
  user_id: number;

  @IsString()
  @ApiProperty({
    type: String,
  })
  key: string;
}

export class MessageThumbnailDto {
  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  domain: string;

  @ApiProperty({
    type: String,
  })
  url: string;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  logo: string;

  @ApiProperty({
    type: String,
  })
  object_id: string;

  @ApiProperty({
    type: Number,
  })
  is_system: number;

  @ApiProperty({
    type: Number,
  })
  type_system: number;

  @ApiProperty({
    type: Number,
  })
  is_thumb: number;
}

export class HandleMessageDto {
  @ApiProperty({
    type: String,
  })
  key_error: string;
}
