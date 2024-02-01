import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FriendWithParamDto {
  @ApiProperty({
    type: String,
    example: 99453,
    description: 'id của người dùng muốn lấy danh sách bạn bè',
  })
  @IsMongoId({
    message: 'string không hợp lệ',
  })
  id: string;
}
