import { ApiProperty } from '@nestjs/swagger';
import { BaseUserResponse } from './user.response';
import { BaseResponse } from 'src/shared/base-response.response';

enum ContactTypeSwagger {
  'ITS_ME' = 0, // ITS_ME // chính mình
  'NOT_FRIEND' = 1, //chưa là bạn
  'WAITING_CONFIRM' = 2, // - WAITING_CONFIRM // họ gửi lời mời, đợi mình xác nhận
  'WAITING_RESPONSE' = 3, // - WAITING_RESPONSE // mình gửi lời mời, đợi họ phản hồi
  'FRIEND' = 4, // FRIEND // đã là bạn'Hai người đã là bạn bè',
}

export class FriendResponse extends BaseUserResponse {
  @ApiProperty({
    type: Number,
    enum: ContactTypeSwagger,
    example: 0,
    description: `
    0 - ITS_ME // chính mình
    1 - NOT_FRIEND // chưa là bạn
    2 - WAITING_CONFIRM // họ gửi lời mời, đợi mình xác nhận
    3 - WAITING_RESPONSE // mình gửi lời mời, đợi họ phản hồi
    4 - FRIEND // đã là bạn
    `,
  })
  contact_type: number;

  // @ApiProperty({
  //   type: String,
  //   example: '50295',
  // })
  // position: string;

  // @ApiProperty({
  //   type: Number,
  //   example: 0,
  //   description: '0 - là offline, 1 - là online',
  // })
  // is_online: number;

  @ApiProperty({
    type: String,
    example: '10-12-2022 14:14:53',
    description: 'Thời gian khi gửi lời mời',
  })
  created_at: string;

  @ApiProperty({
    type: String,
    example: 'Anh Huy Hiệu',
    description: 'Tên của user trong danh bạ',
  })
  name_phone: string;
  @ApiProperty({
    type: Number,
    example: 0,
    description: 'Trạng thái của user',
  })
  user_status: number;

  constructor(data?: any) {
    super(data);
    this.contact_type = data?.contact_type || 0;
    this.created_at = data?.created_at || '';
    this.name_phone = data?.name_phone || '';
    this.user_status = data?.status || 1;
  }
}

export class FriendResponseSwagger extends BaseResponse {
  @ApiProperty({
    type: FriendResponse,
    isArray: true,
  })
  data: FriendResponse;
}
