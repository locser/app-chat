import { ApiResponseProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiResponseProperty({
    type: Number,
    example: 200,
  })
  status: number;

  @ApiResponseProperty({
    type: String,
    example: 'success',
  })
  message: string;

  @ApiResponseProperty({
    example: {},
  })
  data: any;

  constructor(status?: number, message?: string, data?: any) {
    this.status = status || 200;
    this.message = message || 'success';
    this.data = data || null;
  }
}
