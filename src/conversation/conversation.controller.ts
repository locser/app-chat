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
import { RequestWithUser } from 'src/shared/requests.type';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { DetailConversation } from './dto/detail-conversation.dto';
import { CreateConversationResponse } from './response/create-conversation-response';
import { QueryConversation } from './response/query-conversation.dto';
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

  @Get('')
  async getListConversation(
    @Request() req: RequestWithUser,
    @Query() query: QueryConversation,
  ) {
    const data = await this.conversationService.getListConversation(
      req.user._id,
      query,
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

  @Post('pinned')
  @ApiOperation({ summary: 'Ghim cuộc trò chuyện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ghim cuộc trò chuyện',
  })
  async pinConversation(
    @Request() req: RequestWithUser,
    @Query() query: DetailConversation,
  ) {
    const data = await this.conversationService.pinConversation(
      req.user._id,
      query.conversation_id,
    );
    return data;
  }

  @Post('hidden')
  @ApiOperation({ summary: 'Ẩn cuộc trò chuyện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ẩn cuộc trò chuyện',
  })
  async hiddenConversation(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
  ) {
    const data = await this.conversationService.hiddenConversation(
      param.conversation_id,
      req.user._id,
    );
    return data;
  }

  @Post('delete')
  @ApiOperation({ summary: 'Xoá cuộc trò chuyện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Xoá cuộc trò chuyện',
  })
  async deleteConversation(
    @Query() param: DetailConversation,

    @Request() req: RequestWithUser,
  ) {
    const data = await this.conversationService.deleteConversation(
      param.conversation_id,
      req.user._id,
    );
    return data;
  }

  @Post('notify')
  @ApiOperation({ summary: 'Tắt bật thông báo cuộc trò chuyện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tắt bật thông báo cuộc trò chuyện',
  })
  async notifyConversation(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
  ) {
    const data = await this.conversationService.disableNotify(
      param.conversation_id,
      req.user._id,
    );
    return data;
  }

  // @Post('join-link')
  // @ApiOperation({ summary: 'Bật tắt tham gia bằng link' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Bật tắt tham gia bằng link',
  // })
  // async isJoinWithLink(
  //   @Request() req: RequestWithUser,
  //   @Query() param: DetailConversation,
  // ) {
  //   const data = await this.conversationService.isJoinWithLink(
  //     param.conversation_id,
  //     req.user._id,
  //   );
  //   return data;
  // }

  // @Post('update-name')
  // @ApiOperation({ summary: 'Tham gia bằng link' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   type: JoinWithLinkResponseSwagger,
  //   description: 'Tham gia bằng link',
  // })
  // async joinWithLink(
  //   @Request() req: RequestWithUser,
  //   @Query() param: QueryJoinWithLinkConversationDto,
  // ) {
  //   const data: any = await this.conversationService.joinWithLink(
  //     param.link,
  //     req.user._id,
  //   );
  //   return data;
  // }

  // @Post('update-background')
  // @ApiOperation({ summary: 'Tham gia bằng link' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Tham gia bằng link',
  // })
  // async joinWithLink(
  //   @Request() req: RequestWithUser,
  //   @Query() param: QueryJoinWithLinkConversationDto,
  // ) {
  //   const data: any = await this.conversationService.joinWithLink(
  //     param.link,
  //     req.user._id,
  //   );
  //   return data;
  // }

  // @Post('join-link/:link')
  // @ApiOperation({ summary: 'Tham gia bằng link' })
  // @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Tham gia bằng link',
  // })
  // async joinWithLink(
  //   @Request() req: RequestWithUser,
  //   @Query() param: QueryJoinWithLinkConversationDto,
  // ) {
  //   const data: any = await this.conversationService.joinWithLink(
  //     param.link,
  //     user.user_id,
  //   );
  //   return data;
  // }
}
