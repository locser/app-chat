import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config-mongo/config-mongo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { FriendModule } from './friend/friend.module';
import { ConnectionModule } from './connection/connection.module';

@Module({
  imports: [ConfigModule, UserModule, AuthModule, ConversationModule, MessageModule, FriendModule, ConnectionModule],
  controllers: [AppController],

  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
