import { Request } from 'express';
import { User } from 'src/shared';

export interface RequestWithUser extends Request {
  user: User;
}
