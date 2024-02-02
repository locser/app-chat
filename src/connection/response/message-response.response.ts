import { ApiProperty } from '@nestjs/swagger';
// import { NameTagResponse } from '../name-tag.response';
// import { StickerResponse } from '../sticker.response';
import { UserMessageResponse } from './user-message.response';
import { MessageObjectInteractedResponse } from './message-interacted.response';
import { NameTagResponse } from './tag-user.response';
// import { ConversationMessageAlolineResponse } from '';
// import { MessageObjectInteractedAlolineResponse } from '';
// import { MessageVoteAlolineResponse } from '';
// import { UserAlolineBaseResponse } from '';

export class MessageAlolineResponse {
  @ApiProperty({
    type: String,
  })
  message_id: string;

  @ApiProperty({
    type: Number,
  })
  type: number;

  @ApiProperty({
    type: UserMessageResponse,
  })
  user: UserMessageResponse;

  @ApiProperty({
    type: UserMessageResponse,
    isArray: true,
  })
  user_target?: UserMessageResponse[];

  @ApiProperty({
    type: NameTagResponse,
    isArray: true,
  })
  tag?: NameTagResponse[];

  @ApiProperty({
    type: String,
  })
  message?: string;

  @ApiProperty({
    type: String,
    isArray: true,
  })
  media?: string[];

  @ApiProperty({
    type: MessageObjectInteractedResponse,
  })
  message_object_interacted?: MessageObjectInteractedResponse;

  @ApiProperty({
    type: String,
  })
  sticker?: string;

  // @ApiProperty({
  //   type: MessageVoteResponse,
  // })
  // message_vote?: MessageVoteResponse;

  @ApiProperty({
    type: String,
  })
  position: string;

  @ApiProperty({
    type: String,
  })
  created_at: string | number;

  @ApiProperty({
    type: String,
  })
  updated_at: string | number;

  @ApiProperty({
    type: UserMessageResponse,
  })
  viewed_users?: UserMessageResponse[];

  @ApiProperty({
    type: String,
  })
  key_error?: string;

  constructor(data?: MessageAlolineResponse) {
    this.message_id = data?.message_id || '0';
    this.type = data?.type || 0;
    this.user = data?.user || new UserMessageResponse();
    this.user_target = data?.user_target || [];
    this.tag = data?.tag || [];
    this.message = data?.message || '';
    // this.thumb = data?.thumb || new ThumbnailResponse();
    this.media = data?.media || [];
    this.message_object_interacted =
      data?.message_object_interacted || new MessageObjectInteractedResponse();
    // this.conversation =
    //   data?.conversation || new ();
    // this.sticker = data?.sticker || new StickerResponse();
    // this.message_vote = data?.message_vote || new MessageVoteResponse();
    this.position = data?.position || '';
    this.created_at = data?.created_at;
    this.updated_at = data?.updated_at;
    this.viewed_users = data?.viewed_users || [];
    this.key_error = data?.key_error || '';
  }
}
