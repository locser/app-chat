import { Prop } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Timestamp } from 'mongodb';

export class BaseModel {
  @Prop({
    type: String,
  })
  _id: string;

  @Prop({
    type: Timestamp,
    nullable: true,
    default: +moment(),
  })
  created_at: number;

  @Prop({
    type: Timestamp,
    nullable: true,
    default: +moment(),
  })
  updated_at: number;
}
