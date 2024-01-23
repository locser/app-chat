import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResponse {
  @ApiProperty({
    example: 85,
    type: String,
    description: 'ID người dùng',
  })
  user_id: string;

  @ApiProperty({
    example: 'wzsfj2vseVwTlCbS2Phy_',
    type: String,
    description: 'Ảnh đại diện',
  })
  avatar: string;

  @ApiProperty({
    example: 'Lê Khánh Duy',
    type: String,
    description: 'Tên đầy đủ',
  })
  full_name: string;

  @ApiProperty({
    example: 'Duy',
    type: String,
    description: 'Tên nick',
  })
  nick_name: string;

  @ApiProperty({
    example: 'Ho Chi Minh',
    type: String,
    description: 'Địa chỉ',
  })
  address: string;

  @ApiProperty({
    example: '0398662602',
    type: String,
    description: 'Số điện thoại',
  })
  phone: string;

  @ApiProperty({
    example: 0,
    type: Number,
    enum: [0, 1],
    description: 'Giới tính ',
  })
  gender: number;

  constructor(data?: any) {
    this.user_id = data?.user_id || '';
    this.avatar = data?.avatar || '';
    this.full_name = data?.full_name || '';
    this.nick_name = data?.nick_name || '';
    this.address = data?.address || '';
    this.phone = data?.phone || '';
    this.gender = +data?.gender || 0;
  }
}
