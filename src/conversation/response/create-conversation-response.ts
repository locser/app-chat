import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/base-response.response';

export class CreateConversationResponse extends BaseResponse {
  @ApiResponseProperty({
    example: {
      conversation_id: '2883031671716627968',
    },
  })
  data: any;
}
