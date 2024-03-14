import { Module } from '@nestjs/common';
import { ConfigModule as ConfigNest } from '@nestjs/config';
import { ConfigMongoService } from './config-mongo.service';

import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySticker,
  CategoryStickerSchema,
  Conversation,
  ConversationDeleteHistory,
  ConversationDeleteHistorySchema,
  ConversationDisableNotify,
  ConversationDisableNotifySchema,
  ConversationHidden,
  ConversationHiddenSchema,
  ConversationMember,
  ConversationMemberSchema,
  ConversationMemberWaitingConfirm,
  ConversationMemberWaitingConfirmSchema,
  ConversationPinned,
  ConversationPinnedSchema,
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
    ConfigNest.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigMongoModule],
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

      {
        name: ConversationHidden.name,
        schema: ConversationHiddenSchema,
      },

      {
        name: ConversationPinned.name,
        schema: ConversationPinnedSchema,
      },
      {
        name: ConversationDisableNotify.name,
        schema: ConversationDisableNotifySchema,
      },
      {
        name: ConversationDeleteHistory.name,
        schema: ConversationDeleteHistorySchema,
      },
    ]),
  ],
  providers: [ConfigMongoService],
  exports: [ConfigMongoService],
})
export class ConfigMongoModule {}
