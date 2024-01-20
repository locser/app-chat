export class BaseResponse {
  status: number;
  message: string;
  data: any;

  constructor(status?: number, message?: string, data?: any) {
    this.status = status || 200;
    this.message = message || 'success';
    this.data = data || null;
  }
}
