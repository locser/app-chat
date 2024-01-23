import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FriendWithParamDto {
  @ApiProperty({
    type: String,
    example: 99453,
    description: 'id của người dùng muốn lấy danh sách bạn bè',
  })
  @IsNumberString(
    {
      no_symbols: true,
    },
    {
      message: '$property phải là số nguyên dương',
    },
  )
  id: string;
}
