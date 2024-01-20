import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
export class SignUpDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @MaxLength(30)
  full_name: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @MaxLength(15)
  nick_name: string;

  @IsNotEmpty()
  @MaxLength(10)
  @IsPhoneNumber('VN', { message: 'So dien thoai bao gom 10 so' })
  @ApiProperty({
    type: String,
    description: 'Số điện thoại đăng nhập',
  })
  phone: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  @ApiProperty({
    type: String,
  })
  @MinLength(4)
  password: string;
}
