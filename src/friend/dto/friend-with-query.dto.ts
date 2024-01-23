import { ApiProperty } from '@nestjs/swagger';

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
  })
  type: number;
}
