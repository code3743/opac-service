export class AppError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode = 500, type = "internal") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}
