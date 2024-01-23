import { Prop } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Timestamp } from 'mongodb';
import { Types } from 'mongoose';

export class BaseModel {
  _id: Types.ObjectId;

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
