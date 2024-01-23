import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class FriendWithParamDto {
  @ApiProperty({
    type: String,
    example: 99453,
    description: 'id của người dùng muốn lấy danh sách bạn bè',
  })
  @IsString({
    message: '$property phải là số nguyên dương',
  })
  id: Types.ObjectId;
}
