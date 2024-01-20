import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class ConfigMongoService {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const uriString = `${'mongodb://localhost:27017/'}${'app-chat'}${'?retryWrites=true&w=majority'}`;
    return {
      // uri: `${process.env.CONFIG_MONGOOSE_HOST}${process.env.CONFIG_MONGOOSE_DB_NAME}${process.env.CONFIG_MONGOOSE_OPTION}`,
      uri: uriString,
    };
  }
}
