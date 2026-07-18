export class ApiResponse {
  constructor(statusCode, data = null, message) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}