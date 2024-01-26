import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FriendWithQueryDto {
  @ApiProperty({
    type: Number,
    example: 10,
    required: false,
  })
  limit: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  page: number;

  @ApiProperty({
    type: Number,
    required: false,
    description:
      '2 là lấy lời mời kết bạn, 3 là xem lại những request bạn bè đã gửi, 4 là bạn bè',
  })
  @IsNumber()
  type: number;
}
