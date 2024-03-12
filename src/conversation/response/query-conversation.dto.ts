import { IsOptional, Min } from 'class-validator';

export class QueryConversation {
  @IsOptional()
  @Min(5)
  limit: number;

  @IsOptional()
  position: string;
}
