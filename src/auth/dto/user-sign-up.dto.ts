import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
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
  @IsString()
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
