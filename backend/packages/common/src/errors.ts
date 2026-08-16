export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_SERVER_ERROR", details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", code: string = "NOT_FOUND", details?: any) {
    super(message, 404, code, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", code: string = "BAD_REQUEST", details?: any) {
    super(message, 400, code, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized", code: string = "UNAUTHORIZED", details?: any) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", code: string = "FORBIDDEN", details?: any) {
    super(message, 403, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict", code: string = "CONFLICT", details?: any) {
    super(message, 409, code, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests. Please try again later.", code: string = "TOO_MANY_REQUESTS", details?: any) {
    super(message, 429, code, details);
  }
}
