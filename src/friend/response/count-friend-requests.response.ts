import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/base-response.response';

export class CountFriendRequestsResponse {
  @ApiProperty({
    example: 0,
    description: 'Số lượng yêu cầu kết bạn',
  })
  no_of_request: number;

  @ApiProperty({
    example: 0,
    description: 'Số lượng lời mời kết bạn',
  })
  no_of_received: number;

  @ApiProperty({
    example: 0,
    description: 'Số lượng bạn bè hiện tại',
  })
  no_of_friend: number;

  constructor(data?: {
    no_of_received: number;
    no_of_request: number;
    no_of_friend: number;
  }) {
    this.no_of_request = data?.no_of_request || 0;
    this.no_of_received = data?.no_of_received || 0;
    this.no_of_friend = data?.no_of_friend || 0;
  }
}

export class CountFriendRequestsResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: CountFriendRequestsResponse,
  })
  data: CountFriendRequestsResponse;
}
