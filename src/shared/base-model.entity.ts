import { Prop } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Types } from 'mongoose';

export class BaseModel {
  _id: Types.ObjectId;

  @Prop({
    type: Number,
    nullable: true,
    default: +moment(),
  })
  created_at: number;

  @Prop({
    type: Number,
    nullable: true,
    default: +moment(),
  })
  updated_at: number;
}
