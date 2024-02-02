import { ApiProperty } from '@nestjs/swagger';
import { UserMessageResponse } from './user-message.response';

export class NameTagResponse {
  @ApiProperty({
    type: UserMessageResponse,
  })
  user: UserMessageResponse;

  @ApiProperty({
    type: String,
  })
  key: string;

  constructor(data?: NameTagResponse) {
    this.user = data?.user || new UserMessageResponse();
    this.key = data?.key || '';
  }
}
