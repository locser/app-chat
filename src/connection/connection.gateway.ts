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
import { Conversation, Message, SocketWithUser, User } from 'src/shared';
import { JoinRoomDto } from './dto/join-room.dto';
import { MessageTextDto } from './dto/message-text.dto';
import { Types } from 'mongoose';

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
        new Types.ObjectId(data.conversation_id),
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

  @SubscribeMessage('message-text')
  async handleMessageText(
    @ConnectedSocket() client: SocketWithUser,
    @MessageBody() data: MessageTextDto,
  ) {
    try {
      const hasAccess = await this.connectionService.beforeJoinRoom(
        client.user._id,
        new Types.ObjectId(data.conversation_id),
      );

      if (!hasAccess) {
        throw new WsException('Bạn không có quyền truy cập!!');
      }

      const { message, conversation } =
        await this.connectionService.handleMessage(client.user._id, data);

      // const messageResponse = new MessageResponse();
      this.emitSocketMessage(
        client.user,
        message,
        conversation,
        'message-text',
      );
    } catch (error) {
      console.log('error:', error);
      this.emitSocketError(
        client.user._id.toString(),
        'message-text',
        'Bạn không có quyền truy cập cuộc trò chuyện này!!',
        error,
      );
    }
  }

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
    user: User,
    new_message: Message,
    conversation: Conversation,
    emit_socket: string,
  ) {
    const to = conversation.members.map(String);

    this.server.to(to).emit(emit_socket, {
      user: user,
      conversation: conversation,
      message: new_message,
    });
  }
}
