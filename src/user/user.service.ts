import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserEntity,
  CategoryStickerEntity,
  ConversationEntity,
  ConversationMemberEntity,
  ConversationMemberWaitingConfirmEntity,
  MessageEntity,
  StickerEntity,
} from 'src/shared';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryStickerEntity)
    private userRepository1: Repository<CategoryStickerEntity>,
    @InjectRepository(ConversationEntity)
    private userRepository2: Repository<ConversationEntity>,
    @InjectRepository(ConversationMemberEntity)
    private userRepository3: Repository<ConversationMemberEntity>,
    @InjectRepository(ConversationMemberWaitingConfirmEntity)
    private userRepository4: Repository<ConversationMemberWaitingConfirmEntity>,
    @InjectRepository(MessageEntity)
    private userRepository5: Repository<MessageEntity>,
    @InjectRepository(StickerEntity)
    private userRepository6: Repository<StickerEntity>,
  ) {}
  async gettt() {
    const newUser = await this.userRepository
      .create({
        full_name: 'loc',
        nick_name: 'locser',
      })
      .save();
    await this.userRepository1
      .create({
        owner_id: '1',
      })
      .save();
    await this.userRepository2.create({}).save();

    await this.userRepository3.create({}).save();
    await this.userRepository4.create({}).save();
    await this.userRepository5.create({}).save();
    await this.userRepository6.create({}).save();
    return newUser;
  }
}
