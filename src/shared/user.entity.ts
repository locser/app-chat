import { Column, Entity } from 'typeorm';
import { BaseModel } from './base-model.entity';
import { USER_STATUS } from '../enum/user.enum';

@Entity('user')
export class UserEntity extends BaseModel {
  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar: string;

  @Column({
    type: 'varchar',
  })
  full_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  nick_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address: string;

  // @Column({
  //   type: 'double precision',
  //   nullable: true,
  // })
  // lat: number;

  // @Column({
  //   type: 'double precision',
  //   nullable: true,
  // })
  // lng: number;

  // @Column({
  //   type: 'int',
  //   default: 0,
  // })
  // no_of_follow: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  cover: string;

  @Column({
    type: 'varchar',
  })
  phone: string;

  @Column({
    type: 'smallint',
    default: 0,
  })
  gender: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  birthday: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  email: string;

  // @Column({
  //   type: 'smallint',
  //   default: BOOLEAN.FALSE,
  // })
  // is_enable_birthday: BOOLEAN;

  // @Column({
  //   type: 'smallint',
  //   default: BOOLEAN.FALSE,
  // })
  // is_enable_phone: BOOLEAN;

  // @Column({
  //   type: 'smallint',
  //   default: BOOLEAN.FALSE,
  // })
  // is_enable_email: BOOLEAN;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  last_connect: Date;

  @Column({
    type: 'smallint',
    default: USER_STATUS.ACTIVE,
  })
  status: USER_STATUS;
}
