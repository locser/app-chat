import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FriendResponse } from '../response/friend.response';
import { BaseResponse } from 'src/shared/base-response.response';

export class Contact {
  @ApiProperty({
    example: 'string',
    type: String,
    description: 'Tên của người dung trong danh bạ',
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '0362777777',
    type: String,
    // isArray: true,
    description: 'Số điện thoại của người dùng',
  })
  phone: string;
}

export class SyncFriendDto {
  @ApiProperty({ type: [Contact] })
  contact: Contact[];
}

export class ContactResponse {
  @ApiProperty({
    example: 10,
    type: Number,
  })
  total_record: number;

  @ApiProperty({
    example: 10,
    type: Number,
  })
  total_record_online: number; // trả về số lượng user online ko cần thiết lắm

  @ApiProperty({
    // example: [FriendResponse],
    type: FriendResponse,
    isArray: true,
  })
  list: FriendResponse[];

  constructor(data: any) {
    this.total_record = data?.total_record || 0;
    this.total_record_online = data?.total_record_online || 0;
    this.list = data?.list || [];
  }
}

export class ContactResponseSwagger extends BaseResponse {
  @ApiProperty({
    example: ContactResponse,
    type: ContactResponse,
  })
  data: ContactResponse;
}
