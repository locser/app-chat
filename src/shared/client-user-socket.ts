import { Socket } from 'socket.io';
import { User } from './user.entity';

export class ClientSocketUser extends Socket {
  user: User;

  device: string;
}
