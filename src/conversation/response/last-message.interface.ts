import { UserMessageResponse } from 'src/connection/response/user-message.response';

export class LastMessageResponse {
  _id: string;
  created_at: string;
  updated_at: string;
  conversation_id: string;
  user: UserMessageResponse;
  user_target: any[];
  message: string;
  media: any[];
  no_of_reaction: number;
  type: number;
  status: number;

  constructor(data: Partial<LastMessageResponse>) {
    this._id = data?._id.toString() || '';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.conversation_id = data.conversation_id;
    this.user = new UserMessageResponse(data.user);
    this.user_target = data.user_target;
    this.message = data.message;
    this.media = data.media;
    this.no_of_reaction = data.no_of_reaction;
    this.type = data.type;
    this.status = data.status;
  }
}
