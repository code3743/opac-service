export class AppError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode = 500, type = "internal") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "auth");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 400, "validation");
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, "not_found");
  }
}
