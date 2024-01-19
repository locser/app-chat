import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

export class BaseModel extends BaseEntity {
  @ObjectIdColumn({
    name: 'id',
    generated: 'identity',
  })
  id: string;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  timestamp: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date;
}
