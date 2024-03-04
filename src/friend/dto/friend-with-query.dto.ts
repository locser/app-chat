import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class FriendWithQueryDto {
  @ApiProperty({
    type: Number,
    example: 10,
    required: false,
  })
  @IsOptional()
  limit: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  page: number;

  @ApiProperty({
    type: Number,
    required: false,
    description:
      '2 là lấy lời mời kết bạn, 3 là xem lại những request bạn bè đã gửi, 4 là bạn bè',
  })
  @IsNotEmpty({ message: 'type là số không được để trống' })
  @IsNumber({}, { message: 'type phải là số' })
  type: number;
}
