import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, Length } from 'class-validator';

export class RequestFriendWithParamDto {
  @ApiProperty({
    type: String,
    example: 99453,
    description: 'id của người nhận yêu cầu',
  })
  @Length(24, 24, { message: 'id không hợp lê' })
  @IsMongoId({
    message: '$property không hợp lệ, mongoId',
  })
  _id: string;
}
