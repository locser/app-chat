import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryFriendDto {
  @ApiPropertyOptional({
    type: String,
    description: `<p>vị trí tiếp theo muốn lấy</p>`,
  })
  position: string;

  @ApiPropertyOptional({
    type: Number,
    example: 20,
    description: `<p>Giới hạn số lượng cần lấy, tối đa 20</p>`,
    maximum: 20,
    minimum: 1,
  })
  limit: string;

  @ApiPropertyOptional({
    type: String,
    description: `<p>Tìm kiếm theo tên hoặc số điện thoại</p>`,
  })
  key_search: string;
}
