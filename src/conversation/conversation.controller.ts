import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/auth/dto/requests.type';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateConversationResponse } from './response/create-conversation-response';
import { DetailConversation } from './dto/detail-conversation.dto';
@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tạo cuộc trò chuyện cá nhân',
    type: CreateConversationResponse,
  })
  @ApiOperation({ summary: 'Tạo cuộc trò chuyện cá nhân' })
  async createNewConversation(
    @Request() req: RequestWithUser,
    @Body() createConversation: CreateConversationDto,
  ) {
    const data = await this.conversationService.createNewConversation(
      req.user._id,
      createConversation,
    );
    return data;
  }

  @Get('detail')
  @ApiOperation({ summary: 'Danh sách cuộc trò chuyện' })
  async detailConversation(
    @Request() req: RequestWithUser,
    @Query() detailConversation: DetailConversation,
  ) {
    const data = await this.conversationService.detailConversation(
      req.user._id,
      detailConversation,
    );
    return data;
  }
}
