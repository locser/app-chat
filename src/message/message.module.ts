import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ConfigModule } from 'src/config-mongo/config-mongo.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [ConfigModule],
})
export class MessageModule {}
