export class DetailConversationResponse {
  conversation_id: string;

  name: string;

  type: number;

  is_pinned: number;

  is_notify: number;

  is_hidden: number;

  is_confirm_new_member: number;

  no_of_not_seen: number;

  no_of_member: number;

  no_of_waiting_confirm: number;

  my_permission: number;

  avatar: string;

  background: string;

  last_message: string;

  position: string;

  last_activity: any;

  created_at: any;

  updated_at: any;

  members: any;

  last_connect: string;
  link_join: string;

  constructor(result?: any) {
    this.conversation_id = result?._id || '';
    this.name = result?.name || '';
    this.type = result?.type || 0;
    this.is_pinned = +result?.is_pinned || 0;
    this.is_notify = +result?.is_notify || 0;
    this.is_hidden = +result?.is_hidden || 0;
    this.is_confirm_new_member = +result?.is_confirm_new_member || 0;
    this.no_of_member = result?.no_of_member || 0;
    this.no_of_not_seen = +result?.no_of_not_seen || 0;
    this.no_of_waiting_confirm = +result?.no_of_waiting_confirm || 0;
    this.my_permission = result?.my_permission || 0;
    this.avatar = result?.avatar || '';
    this.background = result?.background || '';

    this.members = result?.members || [];
    this.position = result?.last_activity || '';
    this.created_at = result?.created_at || '';
    this.updated_at = result?.updated_at || '';
    this.last_activity = result?.last_activity || '';
    this.last_connect = result?.last_connect || '';
    this.link_join = result?.link_join || '';
  }
}
