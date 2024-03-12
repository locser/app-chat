import { IsNotEmpty } from 'class-validator';

export class QueryPhone {
  @IsNotEmpty()
  phone: string;
}
