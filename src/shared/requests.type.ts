import { Request } from 'express';
import { UserResponse } from 'src/shared';

export interface RequestWithUser extends Request {
  user: UserResponse;
}
