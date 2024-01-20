import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(10)
  @IsPhoneNumber('VN', { message: 'So dien thoai bao gom 10 so' })
  @ApiProperty({
    type: String,
    description: 'Số điện thoại đăng nhập',
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
