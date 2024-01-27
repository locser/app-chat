import { Injectable } from '@nestjs/common';
import { MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class ConfigMongoService {
  async createMongooseOptions(): Promise<MongooseModuleOptions> {
    const uriString = `${process.env.MONGODB_HOST}${process.env.MONGODB_DBNAME}${process.env.MONGODB_OPTIONS}`;
    return {
      // uri: `${process.env.CONFIG_MONGOOSE_HOST}${process.env.CONFIG_MONGOOSE_DB_NAME}${process.env.CONFIG_MONGOOSE_OPTION}`,
      uri: uriString,
    };
  }
}
