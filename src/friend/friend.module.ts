import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { Friend, FriendSchema } from 'src/shared/friend.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/shared';
import { Block, BlockSchema } from 'src/shared/block.entity';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Friend.name,
        schema: FriendSchema,
      },
      {
        name: Block.name,
        schema: BlockSchema,
      },
    ]),
  ],
})
export class FriendModule {}
