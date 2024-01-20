import { Module } from '@nestjs/common';
import { ConfigMongoService } from './config-mongo.service';
import { ConfigModule as ConfigNest } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  providers: [ConfigMongoService],
  exports: [ConfigMongoService],
})
export class ConfigModule {}
