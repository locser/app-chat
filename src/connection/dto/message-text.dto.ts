import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
// export class TagUserDto {
//   @ApiProperty({
//     type: String,
//   })
//   key: string;
//   @ApiProperty({
//     type: Number,
//   })
//   user_id: number;
// }

// export class ThumbnailDto {
//   @ApiProperty({
//     type: String,
//   })
//   object_id: string;

//   @ApiProperty({
//     type: String,
//   })
//   domain: string;

//   @ApiProperty({
//     type: String,
//   })
//   title: string;

//   @ApiProperty({
//     type: String,
//   })
//   description: string;

//   @ApiProperty({
//     type: String,
//   })
//   logo: string;

//   @ApiProperty({
//     type: String,
//   })
//   url: string;

//   @ApiProperty({
//     type: Number,
//   })
//   is_system: number;

//   @ApiProperty({
//     type: Number,
//   })
//   type_system: number;

//   @ApiProperty({
//     type: Number,
//   })
//   is_thumb: number;
//   constructor(data: ThumbnailDto) {
//     this.object_id = data.object_id;
//     this.domain = data.domain;
//     this.title = data.title;
//     this.description = data.description;
//     this.logo = data.logo;
//     this.url = data.url;
//     this.is_system = data.is_system;
//     this.type_system = data.type_system;
//     this.is_thumb = data.is_thumb;
//   }
// }

// export class LinkDto {
//   @ApiProperty({
//     type: String,
//   })
//   domain: string;

//   @ApiProperty({
//     type: String,
//   })
//   url: string;
// }

export class MessageTextDto {
  @IsNotEmpty({
    message: '$property không được trống',
  })
  @ApiProperty({
    type: String,
    required: true,
  })
  message: string;

  @IsNotEmpty({
    message: '$property không được trống',
  })
  @ApiProperty({
    type: Types.ObjectId,
    required: true,
  })
  conversation_id: Types.ObjectId;

  @ApiProperty({
    type: Number,
    required: true,
  })
  type: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  created_at?: number;

  // @IsNotEmpty({
  //   message: '$property không được trống',
  // })
  // @ApiProperty({
  //   type: String,
  // })
  // key_error: string;
  // @ApiProperty({
  //   type: TagUserDto,
  //   required: false,
  //   isArray: true,
  // })
  // tag: TagUserDto[];

  // @ApiProperty({
  //   type: ThumbnailDto,
  //   required: false,
  // })
  // thumb: string;

  // @ApiProperty({
  //   type: LinkDto,
  //   required: false,
  // })
  // link: LinkDto[];

  constructor(data: MessageTextDto) {
    this.message = data?.message || '';
    this.conversation_id = data?.conversation_id || new Types.ObjectId();
    // this.tag = data.tag;
    // this.thumb = data.thumb;
    // this.link = data.link;
    // this.key_error = data.key_error;
    this.created_at = data?.created_at;
  }
}
