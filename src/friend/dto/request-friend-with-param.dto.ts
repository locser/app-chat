import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestFriendWithParamDto {
  @ApiProperty({
    type: String,
    example: '60f3e3e3e3e3e3e3e3e3e3e3',
    description: 'id của người nhận yêu cầu',
  })
  @IsString({
    message: '$property không đúng định dạng',
  })
  _id: string;
}
