import { Request } from 'express';

export interface UserResponse {
  _id: string;
  role: string;
  full_name: string;
  avatar: string;
}
export interface RequestWithUser extends Request {
  user: UserResponse;
}
