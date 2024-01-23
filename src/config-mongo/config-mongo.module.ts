import { Module } from '@nestjs/common';
import { ConfigMongoService } from './config-mongo.service';
import { ConfigModule as ConfigNest } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySticker,
  CategoryStickerSchema,
  Conversation,
  ConversationMember,
  ConversationMemberSchema,
  ConversationMemberWaitingConfirm,
  ConversationMemberWaitingConfirmSchema,
  ConversationSchema,
  Message,
  MessageSchema,
  Sticker,
  StickerSchema,
  User,
  UserSchema,
} from 'src/shared';

@Module({
  imports: [
    ConfigNest.forRoot({}),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigMongoService) =>
        await configService.createMongooseOptions(),
      inject: [ConfigMongoService],
    }),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   username: 'postgres',
    //   password: 'loc123@@',
    //   port: 5432,
    //   database: 'app-chat',
    //   entities: [
    //     CategorySticker,
    //     Conversation,
    //     ConversationMember,
    //     ConversationMemberWaitingConfirm,
    //     Message,
    //     Sticker,
    //     User,
    //   ],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: CategorySticker.name,
        schema: CategoryStickerSchema,
      },
      {
        name: ConversationMember.name,
        schema: ConversationMemberSchema,
      },
      {
        name: ConversationMemberWaitingConfirm.name,
        schema: ConversationMemberWaitingConfirmSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },

      {
        name: Sticker.name,
        schema: StickerSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [ConfigMongoService],
  exports: [ConfigMongoService],
})
export class ConfigModule {}
