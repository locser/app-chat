import { IsNotEmpty, Length, Matches, Min } from 'class-validator';

export class QueryPhone {
  @IsNotEmpty()
  @Length(10, 10)
  @Matches(/[0-9]{10}/)
  phone: string;
}
