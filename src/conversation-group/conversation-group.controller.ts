import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/requests.type';
import { ConversationGroupService } from './conversation-group.service';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';

@ApiTags('API TRÒ CHUYỆN NHÓM')
@Controller('conversation-group')
export class ConversationGroupController {
  constructor(
    private readonly conversationGroupService: ConversationGroupService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Tạo cuộc trò chuyện nhóm' })
  async createNewGroupConversation(
    @Request() req: RequestWithUser,
    @Body() createConversation: CreateGroupConversationDto,
  ) {
    const data = await this.conversationGroupService.createNewGroupConversation(
      req.user._id,
      createConversation,
    );
    return data;
  }
}
