import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/requests.type';
import { ConversationParamsDto } from './dto/conversation-param.dto';
import { GetAllMessagesDto } from './dto/get-all-messages.dto';
import { MessageService } from './message.service';
@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Lấy danh sách tin nhắn' })
  @Get(':id')
  async getMessageList(
    @Request() req: RequestWithUser,
    @Param() param: ConversationParamsDto,
    @Query() query: GetAllMessagesDto,
  ) {
    const data = await this.messageService.getMessageList(
      req.user._id,
      param.id,
      query,
    );
    return data;
  }
}
