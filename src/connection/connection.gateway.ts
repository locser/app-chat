import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionService } from './connection.service';
// import { ExceptionResponse } from 'src/shared';
import {
  Conversation,
  ExceptionResponse,
  SocketWithUser,
  UserResponse,
} from 'src/shared';
import { formatUnixTimestamp } from 'src/util';
import { JoinRoomDto } from './dto/join-room.dto';
import { MessageDto } from './dto/message-text.dto';
import { SendCallRequestDto } from './dto/send-call-request.dto';
import { UserMessageResponse } from './response/user-message.response';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConnectionGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connectionService: ConnectionService,
    private jwtService: JwtService,
  ) {}
  afterInit() {
    // this.logger = new Logger('AppGateway');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization;
      const device: any = client.handshake.query?.device;

      if (!token) {
        throw new WsException(`Chưa có token!`);
      }
      if (!device) throw new WsException(`Chưa có device!`);

      /** Kiểm tra token có hợp lệ hay không */

      let payload;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      } catch {
        throw new WsException('Lêu lêu chưa có token');
      }
      if (!payload?._id)
        throw new WsException(`Token không chính xác, nghi vấn hacker gà!`);

      client['user'] = payload;

      client.join(payload._id.toString());
    } catch (error) {
      client.disconnect();
      console.log('handleConnection ~ error:', error);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      console.log('disconnect,,,,,,,,,,,,');
    } catch (error) {
      console.log('handleDisconnect ~ error:', error);
      client.disconnect();
    }
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: JoinRoomDto,
  ) {
    try {
      /** Kiểm tra dữ liệu vào */
      const hasAccess = await this.connectionService.beforeJoinRoom(
        client.user._id,
        data.conversation_id,
      );

      if (!hasAccess) {
        throw new WsException(
          'Bạn không có quyền truy cập cuộc trò chuyện này',
        );
      }

      const room = data.conversation_id.toString();

      client.join(room);

      this.server.to(room).emit('join-room', {
        event: 'join-room',
        message: '',
        data: {
          user_id: client.user._id.toString(),
          conversation_id: data.conversation_id,
        },
      });
    } catch (e) {
      console.log('error join - room:', e);

      this.emitSocketError(
        client.user._id.toString(),
        'join-room',
        'join-room lỗi',
        null,
      );
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: JoinRoomDto,
  ) {
    try {
      const room = data.conversation_id.toString();

      this.server.to(room).emit('typing-off', {
        event: 'typing-room',
        user: client.user,
        conversation_id: room,
      });

      client.leave(room);
    } catch (error) {
      console.log('error join - room:', error);

      this.emitSocketError(
        client.user._id.toString(),
        'leave-room',
        'leave-room lỗi',
        null,
      );
    }
  }

  @SubscribeMessage('typing-on')
  async handleTypingOn(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: JoinRoomDto,
  ) {
    try {
      const room = data.conversation_id.toString();
      this.server.to(room).emit('typing-on', {
        event: 'typing-on',
        message: '',
        data: {
          user_id: client.user._id.toString(),
          conversation_id: room,
        },
      });
    } catch (error) {
      console.log('handleTypingOff ~ error:', error);
      this.handleTypingOff(client, data);
    }
  }

  @SubscribeMessage('typing-off')
  async handleTypingOff(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: JoinRoomDto,
  ) {
    try {
      const room = data.conversation_id.toString();
      this.server.to(room).emit('typing-off', {
        event: 'typing-off',
        user: client.user,
        conversation_id: room,
      });
    } catch (error) {
      console.log('handleTypingOff ~ error:', error);

      this.emitSocketError(
        client.user._id.toString(),
        'typing-off',
        'Bạn không có quyền truy cập cuộc trò chuyện này!!',
        {
          user_id: client.user._id.toString(),
          conversation_id: data.conversation_id,
        },
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: MessageDto,
  ) {
    try {
      const hasAccess = await this.connectionService.beforeJoinRoom(
        client.user._id,
        data.conversation_id,
      );

      if (!hasAccess) {
        throw new WsException('Bạn không có quyền truy cập!!');
      }

      const { message, conversation } =
        await this.connectionService.handleMessage(client.user._id, data);

      // const messageResponse = new MessageResponse();
      this.emitSocketMessage(client.user, message, conversation, 'message');
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'message',
        error?.message || '',
        error,
      );
    }
  }

  @SubscribeMessage('send-call-request')
  async handleSendCallRequest(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: SendCallRequestDto,
  ) {
    try {
      const userTarget = await this.connectionService.validateUserTarget(
        data.target_user_id,
      );

      if (!userTarget) {
        throw new ExceptionResponse(404, 'User không hợp lệ!');
      }

      this.server.to(userTarget._id.toString()).emit('request-call-video', {
        user_from: client.user,
        user_to: userTarget,
        signal_data: data?.signal_data || {},
      });
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'send-call-request',
        error?.message || '',
        error,
      );
    }
  }

  @SubscribeMessage('answer-call-request')
  async handleAnswerCallRequest(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: SendCallRequestDto,
  ) {
    try {
      const userTarget = await this.connectionService.validateUserTarget(
        data.target_user_id,
      );

      if (!userTarget) {
        throw new ExceptionResponse(404, 'User không hợp lệ!');
      }

      this.server.to(userTarget._id.toString()).emit('answer-call-video', {
        user_from: client.user,
        user_to: userTarget,
        signal_data: data?.signal_data || {},
      });
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'answer-call-request',
        error?.message || '',
        error,
      );
    }
  }

  @SubscribeMessage('deny-call-request')
  async handleDenyCallRequest(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: SendCallRequestDto,
  ) {
    try {
      const userTarget = await this.connectionService.validateUserTarget(
        data.target_user_id,
      );

      if (!userTarget) {
        throw new ExceptionResponse(404, 'User không hợp lệ!');
      }

      this.server.to(userTarget._id.toString()).emit('deny-call-video', {
        user_from: client.user,
        user_to: userTarget,
        message: data?.message || 'Người dùng hiện không liên lạc được!',
      });
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'deny-call-request',
        error?.message || '',
        error,
      );
    }
  }

  @SubscribeMessage('call-user')
  async handleCallUser(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: any,
  ) {
    try {
      const hasAccess = await this.connectionService.beforeJoinRoom(
        client.user._id,
        data.conversation_id,
      );

      if (!hasAccess) {
        throw new WsException('Bạn không có quyền truy cập!!');
      }

      const { message, conversation } =
        await this.connectionService.handleMessage(client.user._id, data);

      // const messageResponse = new MessageResponse();
      this.emitSocketMessage(client.user, message, conversation, 'message');
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'message',
        error?.message || '',
        error,
      );
    }
  }

  @SubscribeMessage('revoke-message')
  async handleRevokeMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: any,
  ) {
    try {
      const hasAccess = await this.connectionService.beforeJoinRoom(
        client.user._id,
        data.conversation_id,
      );

      if (!hasAccess) {
        throw new WsException('Bạn không có quyền truy cập!!');
      }

      const { message, conversation } =
        await this.connectionService.handleRevokeMessage(client.user._id, data);

      // const messageResponse = new MessageResponse();
      this.emitSocketMessage(
        client.user,
        message,
        conversation,
        'revoke-message',
      );
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'revoke-message',
        error?.message || '',
        error,
      );
    }
  }

  @SubscribeMessage('reaction-message')
  async handleReactionMessage(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: any,
  ) {
    try {
      const hasAccess = await this.connectionService.beforeJoinRoom(
        client.user._id,
        data.conversation_id,
      );

      if (!hasAccess) {
        throw new WsException('Bạn không có quyền truy cập!!');
      }

      const { message, conversation } =
        await this.connectionService.handleReactionMessage(
          client.user._id,
          data,
        );

      // const messageResponse = new MessageResponse();
      this.emitSocketMessage(
        client.user,
        message,
        conversation,
        'reaction-message',
      );
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'reaction-message',
        error?.message || '',
        error,
      );
    }
  }

  // @SubscribeMessage('message-text')
  // async handleMessageText(
  //   @ConnectedSocket() client: SocketWithUser,
  //   @MessageBody() data: MessageDto,
  // ) {
  //   try {
  //     const hasAccess = await this.connectionService.beforeJoinRoom(
  //       client.user._id,
  //       data.conversation_id,
  //     );

  //     if (!hasAccess) {
  //       throw new WsException('Bạn không có quyền truy cập!!');
  //     }

  //     const { message, conversation } =
  //       await this.connectionService.handleMessage(client.user._id, data);

  //     // const messageResponse = new MessageResponse();
  //     this.emitSocketMessage(
  //       client.user,
  //       message,
  //       conversation,
  //       'message-text',
  //     );
  //   } catch (error) {
  //     console.log('error:', error);
  //     this.emitSocketError(
  //       client.user._id.toString(),
  //       'message-text',
  //       'Bạn không có quyền truy cập cuộc trò chuyện này!!',
  //       error,
  //     );
  //   }
  // }

  // @SubscribeMessage('message-image')
  // async handleMessageImage(
  //   @ConnectedSocket() client: SocketWithUser,
  //   @MessageBody() data: MessageDto,
  // ) {
  //   try {
  //     const hasAccess = await this.connectionService.beforeJoinRoom(
  //       client.user._id,
  //       data.conversation_id,
  //     );

  //     if (!hasAccess) {
  //       throw new WsException('Bạn không có quyền truy cập!!');
  //     }

  //     const { message, conversation } =
  //       await this.connectionService.handleMessage(client.user._id, data);

  //     // const messageResponse = new MessageResponse();
  //     this.emitSocketMessage(
  //       client.user,
  //       message,
  //       conversation,
  //       'message-image',
  //     );
  //   } catch (error) {
  //     console.log('error:', error);
  //     this.emitSocketError(
  //       client.user._id.toString(),
  //       'message-image',
  //       error?.message || '',
  //       error,
  //     );
  //   }
  // }

  // @SubscribeMessage('message-audio')
  // async handleMessageAudio(
  //   @ConnectedSocket() client: SocketWithUser,
  //   @MessageBody() data: MessageDto,
  // ) {
  //   try {
  //     const hasAccess = await this.connectionService.beforeJoinRoom(
  //       client.user._id,
  //       data.conversation_id,
  //     );

  //     if (!hasAccess) {
  //       throw new WsException('Bạn không có quyền truy cập!!');
  //     }

  //     const { message, conversation } =
  //       await this.connectionService.handleMessage(client.user._id, data);

  //     // const messageResponse = new MessageResponse();
  //     this.emitSocketMessage(
  //       client.user,
  //       message,
  //       conversation,
  //       'message-audio',
  //     );
  //   } catch (error) {
  //     console.log('error:', error);
  //     this.emitSocketError(
  //       client.user._id.toString(),
  //       'message-image',
  //       error?.message || '',
  //       error,
  //     );
  //   }
  // }

  // @SubscribeMessage('message-video')
  // async handleMessageVideo(
  //   @ConnectedSocket() client: SocketWithUser,
  //   @MessageBody() data: MessageDto,
  // ) {
  //   try {
  //     const hasAccess = await this.connectionService.beforeJoinRoom(
  //       client.user._id,
  //       data.conversation_id,
  //     );

  //     if (!hasAccess) {
  //       throw new WsException('Bạn không có quyền truy cập!!');
  //     }

  //     const { message, conversation } =
  //       await this.connectionService.handleMessage(client.user._id, data);

  //     // const messageResponse = new MessageResponse();
  //     this.emitSocketMessage(
  //       client.user,
  //       message,
  //       conversation,
  //       'message-video',
  //     );
  //   } catch (error) {
  //     console.log('error:', error);
  //     this.emitSocketError(
  //       client.user._id.toString(),
  //       'message-video',
  //       error?.message || '',
  //       error,
  //     );
  //   }
  // }

  // @SubscribeMessage('message-file')
  // async handleMessageFile(
  //   @ConnectedSocket() client: SocketWithUser,
  //   @MessageBody() data: MessageDto,
  // ) {
  //   try {
  //     const hasAccess = await this.connectionService.beforeJoinRoom(
  //       client.user._id,
  //       data.conversation_id,
  //     );

  //     if (!hasAccess) {
  //       throw new WsException('Bạn không có quyền truy cập!!');
  //     }

  //     const { message, conversation } =
  //       await this.connectionService.handleMessage(client.user._id, data);

  //     // const messageResponse = new MessageResponse();
  //     this.emitSocketMessage(
  //       client.user,
  //       message,
  //       conversation,
  //       'message-file',
  //     );
  //   } catch (error) {
  //     console.log('error:', error);
  //     this.emitSocketError(
  //       client.user._id.toString(),
  //       'message-file',
  //       error?.message || '',
  //       error,
  //     );
  //   }
  // }

  // @SubscribeMessage('message-reply')
  // async handleMessageReply(
  //   @ConnectedSocket() client: SocketWithUser,
  //   @MessageBody() data: MessageDto,
  // ) {
  //   try {
  //     const hasAccess = await this.connectionService.beforeJoinRoom(
  //       client.user._id,
  //       data.conversation_id,
  //     );

  //     if (!hasAccess) {
  //       throw new WsException('Bạn không có quyền truy cập!!');
  //     }

  //     const { message, conversation } =
  //       await this.connectionService.handleMessage(client.user._id, data);

  //     // const messageResponse = new MessageResponse();
  //     this.emitSocketMessage(
  //       client.user,
  //       message,
  //       conversation,
  //       'message-reply',
  //     );
  //   } catch (error) {
  //     console.log('error:', error);
  //     this.emitSocketError(
  //       client.user._id.toString(),
  //       'message-reply',
  //       error?.message || '',
  //       error,
  //     );
  //   }
  // }

  /** SUB FUNCTION */

  async emitSocketError(
    user_id: string,
    event_error: string,
    message: string,
    error: any,
  ) {
    this.server.to(user_id).emit(event_error, {
      event: event_error,
      message: message,
      data: error,
    });
  }
  async emitSocketMessage(
    user: UserResponse,
    new_message: any,
    conversation: Conversation,
    emit_socket: string,
  ) {
    const to = conversation.members.map(String);

    new_message.updated_at = formatUnixTimestamp(new_message.updated_at);
    new_message.created_at = formatUnixTimestamp(new_message.created_at);
    new_message.user = new UserMessageResponse(user);
    new_message.conversation = conversation;

    this.server.to(to).emit(emit_socket, {
      message: new_message,
    });
  }
}
