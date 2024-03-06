import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(10)
  @ApiProperty({
    type: String,
    description: 'Số điện thoại đăng nhập',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
