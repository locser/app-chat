import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/shared/requests.type';
import { ConversationGroupService } from './conversation-group.service';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { DetailConversation } from 'src/conversation/dto/detail-conversation.dto';
import { QueryJoinWithLinkConversationDto } from './dto/query-join-with-link.dto';
import { UpdatePermissionConversation } from './dto/update-permission.dto';
import { AddMemberConversationDto } from './dto/add-member-conversation.dto';

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

  @Post('join-link')
  @ApiOperation({ summary: 'Bật tắt tham gia bằng link' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bật tắt tham gia bằng link',
  })
  async isJoinWithLink(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
  ) {
    const data = await this.conversationGroupService.isJoinWithLink(
      param.conversation_id,
      req.user._id,
    );
    return data;
  }

  @Post('join-with-link')
  @ApiOperation({ summary: 'Tham gia bằng link' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tham gia bằng link',
  })
  async joinWithLink(
    @Request() req: RequestWithUser,
    @Query() param: QueryJoinWithLinkConversationDto,
  ) {
    const data: any = await this.conversationGroupService.joinWithLink(
      param.link_join,
      req.user._id,
    );
    return data;
  }

  @Post('update-permission')
  @ApiOperation({ summary: 'Update quyền của member trong cuộc trò chuyện ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update quyền của member trong cuộc trò chuyện ',
  })
  async updatePermissionMemberConversation(
    @Request() req: RequestWithUser,
    @Body() body: UpdatePermissionConversation,
    @Query() param: DetailConversation,
  ) {
    const data: any =
      await this.conversationGroupService.updatePermissionConversation(
        param.conversation_id,
        body,
        req.user._id,
      );
    return data;
  }

  @Post('leave')
  @ApiOperation({ summary: 'User rời nhóm cuộc trò chuyện ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User rời nhóm  cuộc trò chuyện ',
  })
  async userLeaveConversation(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
  ) {
    const data: any = await this.conversationGroupService.userLeaveConversation(
      param.conversation_id,
      req.user._id,
    );
    return data;
  }

  @Post('disband')
  @ApiOperation({ summary: 'Giải tán cuộc trò chuyện ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Giải tán cuộc trò chuyện ',
  })
  async disbandConversation(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
  ) {
    const data: any = await this.conversationGroupService.disbandConversation(
      param.conversation_id,
      req.user._id,
    );
    return data;
  }

  @Post('add-member')
  @ApiOperation({ summary: 'Thêm thành viên cuộc trò chuyện ' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Thêm thành viên cuộc trò chuyện ',
  })
  async addMembersConversation(
    @Request() req: RequestWithUser,
    @Query() param: DetailConversation,
    @Body() body: AddMemberConversationDto,
  ) {
    const data: any =
      await this.conversationGroupService.addMembersConversation(
        param.conversation_id,
        req.user._id,
        body,
      );
    return data;
  }
}
