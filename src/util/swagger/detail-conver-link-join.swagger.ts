import { ApiProperty } from '@nestjs/swagger';

export class DetailConversationLinkJoin {
  @ApiProperty({
    type: String,
    example: '2883031671716627968',
    description: 'id của cuộc trò truyện',
  })
  conversation_id: string;

  @ApiProperty({
    type: String,
    example: 'Cuộc trò chuyện',
    description: 'tên của cuộc trò truyện',
  })
  name: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'type của conversation || 0 - system, 1 - group, 2 - private',
  })
  type: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'có bật duyệt thành viên hay không',
  })
  is_confirm_new_member: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description:
      'có phải là thành viên hay không (0 - chưa là thành viên, 1 - Đã yêu cầu tham gia, 2 - Đã tham gia nhóm)',
  })
  is_join: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'số người trong cuộc trò truyện',
  })
  no_of_member: number;

  //   @ApiProperty({
  //     type: AvatarResponseSwagger,
  //     example: AvatarResponseSwagger,
  //     description: 'avatar của cuộc trò truyện',
  //   })
  //   avatar: IMedia;

  //   @ApiProperty({
  //     type: AvatarResponseSwagger,
  //     example: AvatarResponseSwagger,
  //     description: 'background của cuộc trò truyện',
  //   })
  //   background: IMedia;

  @ApiProperty({
    type: String,
    description: 'Link Tham gia cuộc trò truyện',
    example: 'FQzqPweHVGF_y85fkL5Xa',
  })
  link_join: string;

  @ApiProperty({
    type: String,
    example: '23-12-2022 16:15:28',
    description: 'thời gian lần cuối hoạt động của cuộc trò truyện',
  })
  last_activity: string;

  @ApiProperty({
    type: String,
    example: '23-12-2022 16:15:28',
    description: 'thời gian tạo của cuộc trò truyện',
  })
  created_at: string;

  @ApiProperty({
    type: String,
    example: '23-12-2022 16:15:28',
    description: 'thời gian cập nhật gần nhất của cuộc trò truyện',
  })
  updated_at: string;

  @ApiProperty({
    type: Array,
    example: [
      {
        user_id: 81484,
        name: 'Minh',
        avatar: 'avatar',
      },
    ],
    description: 'ID của member',
  })
  members: any;

  constructor(data?: Partial<DetailConversationLinkJoin>) {
    this.conversation_id = data?.conversation_id || '';
    this.name = data?.name || '';
    this.type = data?.type || 0;
    this.is_confirm_new_member = data?.is_confirm_new_member || 0;
    this.no_of_member = data?.no_of_member || 0;
    this.link_join = data?.link_join || '';
    //     this.avatar = data?.avatar || new MediaResponse();
    //     this.background = data?.background || new MediaResponse();
    this.members = data?.members || [];
    this.is_join = data?.is_join || 0;
    this.created_at = data?.created_at || '';
    this.updated_at = data?.updated_at || '';
    this.last_activity = data?.last_activity || '';
  }
}

export class DetailConversationLinkJoinSwagger {
  @ApiProperty({
    type: [DetailConversationLinkJoin],
  })
  data: DetailConversationLinkJoin[];
}
