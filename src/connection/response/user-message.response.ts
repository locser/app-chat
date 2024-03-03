export class UserMessageResponse {
  _id: string;
  avatar: string;
  full_name: string;
  constructor(data?: UserMessageResponse | any) {
    this._id = data?.user_id || data?._id || '';
    this.avatar = data?.avatar || '';
    this.full_name = data?.full_name || '';
  }
}
