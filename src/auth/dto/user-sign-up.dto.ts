import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, MaxLength, MinLength } from 'class-validator';
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
  @Length(10, 10, { message: 'Phone gồm 10 số' })
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
