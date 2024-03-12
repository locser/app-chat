import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
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
import { Friend, FriendSchema } from 'src/shared/friend.entity';

@Module({
  imports: [
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
        name: Friend.name,
        schema: FriendSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
