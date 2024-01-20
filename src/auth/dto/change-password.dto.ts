import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Max, Min } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Mật khẩu cũ',
  })
  @Min(8)
  @Max(15)
  old_password: string;
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Mật khẩu mới',
  })
  @Min(8)
  @Max(15)
  new_password: string;
}
