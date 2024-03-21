import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ParamConversationLinkJoinDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'jaskqwkasjadsd',
    description: 'link_join của cuộc trò chuyện',
  })
  link_join: string;
}
