import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryGetListReaction {
  @ApiPropertyOptional({
    type: String,
    description: 'Id của cuộc trò chuyện',
  })
  limit: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Id của cuộc trò chuyện',
  })
  position: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Loại reaction (-1 - ALL, 1 - LIKE, 2 - LOVE, 3 - HAHA, 4 - WOW, 5 - SAD, 6 - ANGRY)',
  })
  type: number;
}
