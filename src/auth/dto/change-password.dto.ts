import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Mật khẩu cũ',
  })
  @MinLength(8)
  @MaxLength(15)
  old_password: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Mật khẩu mới',
  })
  @MinLength(8)
  @MaxLength(15)
  new_password: string;
}
