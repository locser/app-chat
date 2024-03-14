import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConnectionModule } from './connection/connection.module';
import { ConversationModule } from './conversation/conversation.module';
import { FriendModule } from './friend/friend.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { ConversationGroupModule } from './conversation-group/conversation-group.module';
import { ConfigMongoModule } from './config-mongo/config-mongo.module';

@Module({
  imports: [
    ConfigMongoModule,
    AuthModule,
    ConversationModule,
    UserModule,

    MessageModule,
    FriendModule,
    ConnectionModule,
    ConversationGroupModule,
  ], //
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
