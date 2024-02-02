import { Socket } from 'socket.io';
import { UserResponse } from './user-base.response';

export class SocketWithUser extends Socket {
  user: UserResponse;

  device: string;
}
