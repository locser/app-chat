import { Module } from '@nestjs/common';
import { ConfigMongoService } from './config-mongo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as ConfigNest } from '@nestjs/config';
import {
  CategoryStickerEntity,
  ConversationEntity,
  ConversationMemberEntity,
  ConversationMemberWaitingConfirmEntity,
  MessageEntity,
  StickerEntity,
  UserEntity,
} from 'src/shared';

@Module({
  imports: [
    ConfigNest.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'app-chat',
      entities: [
        CategoryStickerEntity,
        ConversationEntity,
        ConversationMemberEntity,
        ConversationMemberWaitingConfirmEntity,
        MessageEntity,
        StickerEntity,
        UserEntity,
      ],
      retryWrites: true,
      w: 'majority',
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: 'postgres',
    //   password: 'loc123@@',
    //   port: 5432,
    //   database: 'app-chat',
    //   entities: [
    //     CategoryStickerEntity,
    //     ConversationEntity,
    //     ConversationMemberEntity,
    //     ConversationMemberWaitingConfirmEntity,
    //     MessageEntity,
    //     StickerEntity,
    //     UserEntity,
    //   ],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
  ],
  providers: [ConfigMongoService],
})
export class ConfigModule {}
