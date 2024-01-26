import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumberString, IsOptional, ValidateIf } from 'class-validator';

export class GetAllMessagesDto {
  @IsOptional()
  @IsNumberString(
    {},
    {
      message: '$property phải là số nguyên',
    },
  )
  @ApiPropertyOptional({
    type: Number,
    description: 'Gioi han message text',
    example: 5,
  })
  limit: number;

  @ValidateIf(o => +o.arrow === 3)
  @IsNotEmpty({
    message: '$property không được để trống',
  })
  @ApiPropertyOptional({
    type: String,
    description: 'Vi tri cua message theo truong position, neu lay tu dau khong can truyen',
    example: '123321',
  })
  position: string;

  @IsNumberString(
    {},
    {
      message: '$property phải là số nguyên',
    },
  )
  @IsIn(['1', '2', '3'], {
    message: '$property phải là một trong các giá trị sau: 1, 2, 3',
  })
  @ApiProperty({
    type: Number,
    description: `
    1 - Vuốt lên, lấy tin nhắn có id nhỏ hơn desc,
    2 - Vuốt xuống, lấy tin nhắn có id lớn hơn asc,
    3 - Khi nhấn vào dịch chuyển tới tin reply, kèm theo position của tin nhắn đc reply
    `,
    example: 1,
  })
  arrow: string;
}
