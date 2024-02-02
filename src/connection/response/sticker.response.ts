// import { ApiProperty } from '@nestjs/swagger';
// import {
//   MediaFormatOriginResponse,
//   MediaFormatResponse,
// } from './media.response';

// export class StickerResponse {
//   @ApiProperty({
//     type: String,
//   })
//   sticker_id: string;

//   @ApiProperty({
//     type: String,
//   })
//   category_sticker_id: string;

//   @ApiProperty({
//     type: Number,
//   })
//   is_download: number;

//   @ApiProperty({
//     type: MediaFormatOriginResponse,
//   })
//   original: MediaFormatOriginResponse;

//   @ApiProperty({
//     type: MediaFormatResponse,
//   })
//   medium: MediaFormatResponse;

//   @ApiProperty({
//     type: MediaFormatResponse,
//   })
//   thumb: MediaFormatResponse;

//   constructor(data?: StickerResponse) {
//     this.sticker_id = data?.sticker_id || '0';
//     this.category_sticker_id = data?.category_sticker_id || '0';
//     this.is_download = data?.is_download || 0;
//     this.original = new MediaFormatOriginResponse(data?.original);
//     this.medium = new MediaFormatResponse(data?.medium);
//     this.thumb = new MediaFormatResponse(data?.thumb);
//   }
// }
