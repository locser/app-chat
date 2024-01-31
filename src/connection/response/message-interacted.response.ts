import { ApiProperty } from '@nestjs/swagger';

import { UserMessageResponse } from './user-message.response';
import { NameTagResponse } from './tag-user.response';

export class MessageObjectInteractedResponse {
  @ApiProperty({
    type: String,
  })
  message_id: string;

  @ApiProperty({
    type: String,
  })
  message: string;

  @ApiProperty({
    type: Number,
  })
  type: number;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  media: string[];

  @ApiProperty({
    type: NameTagResponse,
    isArray: true,
  })
  tag: NameTagResponse[];

  @ApiProperty({
    type: UserMessageResponse,
  })
  user: UserMessageResponse;

  @ApiProperty({
    type: String,
  })
  sticker: string;

  @ApiProperty({
    type: String,
  })
  position: string;

  constructor(data?: MessageObjectInteractedResponse) {
    this.message_id = data?.message_id || '0';
    this.message = data?.message || '';
    this.type = data?.type || 0;
    this.media = data?.media || [];
    this.tag = data?.tag || [];
    this.user = data?.user || new UserMessageResponse();
    this.sticker = data?.sticker || '';
    this.position = data?.position || '';
  }
}
