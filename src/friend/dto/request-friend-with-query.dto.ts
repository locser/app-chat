import { ApiProperty } from '@nestjs/swagger';

export class RequestFriendWithQueryDto {
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
  position: number;
}
