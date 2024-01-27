import { Socket } from 'socket.io';
import { User } from './user.entity';

export class SocketWithUser extends Socket {
  user: User;

  device: string;
}
