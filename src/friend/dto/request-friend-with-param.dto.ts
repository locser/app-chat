import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class RequestFriendWithParamDto {
  @ApiProperty({
    type: String,
    example: 99453,
    description: 'id của người nhận yêu cầu',
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
