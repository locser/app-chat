import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RequestFriendWithParamDto {
  @ApiProperty({
    type: String,
    example: 99453,
    description: 'id của người nhận yêu cầu',
  })
  @IsString({
    message: '$property phải là số nguyên dương',
  })
  _id: Types.ObjectId;
}
