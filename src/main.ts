import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { FriendModule } from './friend/friend.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Service Message ' + process.env.CONFIG_PRODUCTION_MODE)
    .setDescription(`The Message Service V1 API description`)
    .setVersion('0.0.11')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      MessageModule,
      UserModule,
      ConversationModule,
      FriendModule,
      AuthModule,
    ],
    deepScanRoutes: true,
  });
  SwaggerModule.setup(process.env.CONFIG_PREFIX + 'v1/docs', app, document, {
    customSiteTitle: 'Message API swagger',
  });

  await app.listen(3000);

  console.log('bootstrap ~ 3000:', 3000);
}
bootstrap();
