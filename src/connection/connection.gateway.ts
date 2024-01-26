import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionService } from './connection.service';
import { ExceptionResponse } from 'src/shared';
import { HttpStatus } from '@nestjs/common';

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
        throw new ExceptionResponse(
          HttpStatus.UNAUTHORIZED,
          'Lêu lêu chưa có token',
        );
      }
      if (!payload?.user_id)
        throw new WsException(`Token không chính xác, nghi vấn hacker gà!`);

      client['user'] = payload;
      1;
      client['device'] = device;
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
}
