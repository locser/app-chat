import { UserMessageResponse } from 'src/connection/response/user-message.response';

export class ListMessageResponse {
  user: UserMessageResponse;
  _id: string;
  conversation_id: string;
  user_target: any;
  message: string;
  media: any;
  no_of_reaction: any;
  type: number;
  status: number;
  user_tag: any;
  created_at: string;
  updated_at: string;
  position: string;

  constructor(data: any) {
    this._id = data?._id || '';
    this.user = new UserMessageResponse(data?.user);
    this.conversation_id = data?.conversation_id || '';
    this.user_target = data?.user_target || [];
    this.message = data?.message || '';
    this.media = data?.media || [];
    this.no_of_reaction = data?.no_of_reaction || [];
    this.type = data?.type || 1;
    this.status = data?.status || 1;
    this.user_tag = data?.user_tag || [];
    this.created_at = data?.created_at || '';
    this.updated_at = data?.updated_at || '';
    this.position = data?.position || '';
  }
}
