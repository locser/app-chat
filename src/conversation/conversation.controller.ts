import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/requests.type';
import { DetailConversationLinkJoinSwagger } from 'src/util/swagger/detail-conver-link-join.swagger';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { DetailConversation } from './dto/detail-conversation.dto';
import { ParamConversationLinkJoinDto } from './dto/link-join-conver.dto';
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

  @Get('1')
  @ApiOperation({ summary: 'Danh sách cuộc trò chuyện' })
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

  @Get('')
  @ApiOperation({ summary: 'Danh sách cuộc trò chuyện' })
  async getListConversation1(
    @Request() req: RequestWithUser,
    @Query() query: QueryConversation,
  ) {
    const data = await this.conversationService.getListConversation1(
      req.user._id,
      query,
    );
    return data;
  }

  @Get('pinned')
  @ApiOperation({ summary: 'Danh sách cuộc trò chuyện' })
  async getListPinnedConversation(@Request() req: RequestWithUser) {
    const data = await this.conversationService.getListPinnedConversation(
      req.user._id,
    );
    return data;
  }

  @Get('detail')
  @ApiOperation({ summary: 'Chi tiết cuộc trò chuyện' })
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

  @Post('is_confirm_member')
  @ApiOperation({ summary: 'Bật tắt duyệt thành viên' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bật tắt duyệt thành viên',
  })
  async settingConfirmMemberConversation(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
  ) {
    const data =
      await this.conversationService.settingConfirmMemberConversation(
        param.conversation_id,
        req.user._id,
      );
    return data;
  }

  @Post('update-name')
  @ApiOperation({ summary: 'Đổi tên cuộc trò chuyện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đổi tên cuộc trò chuyện',
  })
  async updateNameConversation(
    @Request() req: RequestWithUser,
    @Body('name') name: string,
    @Query() param: DetailConversation,
  ) {
    const data: any = await this.conversationService.updateNameConversation(
      param.conversation_id,
      name,
      req.user._id,
    );
    return data;
  }

  @Post('update-background')
  @ApiOperation({ summary: 'Đổi back-ground cuộc trò chuyện' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đổi back-ground cuộc trò chuyện',
  })
  async updateBackGroundConversation(
    @Request() req: RequestWithUser,
    @Body('back_ground') back_ground: string,
    @Query() param: DetailConversation,
  ) {
    const data: any =
      await this.conversationService.updateBackgroundConversation(
        param.conversation_id,
        back_ground,
        req.user._id,
      );
    return data;
  }

  @Get(':link_join/detail')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy chi tiết cuộc trò truyện theo link join',
    type: DetailConversationLinkJoinSwagger,
  })
  @ApiOperation({ summary: 'Lấy chi tiết cuộc trò truyện theo link join' })
  async getDetailConversationWithLinkJoin(
    @Request() req: RequestWithUser,
    @Param() param: ParamConversationLinkJoinDto,
  ) {
    const data =
      await this.conversationService.getDetailConversationWithLinkJoin(
        param.link_join,
        req.user._id,
      );
    return data;
  }
}
