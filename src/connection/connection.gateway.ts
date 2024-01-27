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
import { SocketWithUser } from 'src/shared';
import { JoinRoomDto } from './dto/join-room.dto';

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
    // private logger: Logger,
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
      console.log('handleConnection ~ payload:', payload);

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
      console.log('room:', room);

      client.join(room);

      this.server.to(room).emit('join-room', {
        event: 'join-room',
        user: client.user,
        conversation_id: data.conversation_id,
      });
    } catch (e) {
      console.log('error join - room:', e);
      this.server.to(client.user._id.toString()).emit('join-room', {
        error: e,
      });
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
      console.log('user roi room');
    } catch (error) {
      console.log('error join - room:', error);

      this.server
        .to(client.user._id.toString())
        .emit('leave-room', JSON.parse(error));
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
        user: client.user,
        conversation_id: room,
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
      this.server.to(client.user._id.toString()).emit('typing-off', {
        event: 'typing-off',
        user: client.user,
        conversation_id: data.conversation_id,
      });
    }
  }
}
