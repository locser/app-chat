export class UserMessageResponse {
  user_id: number;
  avatar: string;
  full_name: string;
  constructor(data?: UserMessageResponse | any) {
    this.user_id = data?.user_id || data._id || '';
    this.avatar = data?.avatar || '';
    this.full_name = data?.full_name || '';
  }
}
