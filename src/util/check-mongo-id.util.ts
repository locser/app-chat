import { Types } from 'mongoose';

export function checkMongoId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}
