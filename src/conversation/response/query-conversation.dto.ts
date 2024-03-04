import { IsNumberString, IsOptional } from 'class-validator';

export class QueryConversation {
  @IsOptional()
  @IsNumberString({}, { message: 'limit must be a number' })
  limit: string;

  position: string;
}
