import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forFeature([
      CategoryStickerEntity,
      ConversationEntity,
      ConversationMemberEntity,
      ConversationMemberWaitingConfirmEntity,
      MessageEntity,
      StickerEntity,
      UserEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
