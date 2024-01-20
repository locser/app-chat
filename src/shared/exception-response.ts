import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionResponse extends HttpException {
  constructor(status?: HttpStatus, message?: string, data?: any) {
    super(
      {
        status: status || HttpStatus.BAD_REQUEST,
        message: message || 'ExceptionResponse - Dữ liệu không hợp lệ!',
        data: data || null,
      },
      HttpStatus.OK,
    );
  }
}

export class CatchException extends ExceptionResponse {
  constructor(error: any) {
    super(error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR, error?.message || 'Something went wrong!');
  }
}
