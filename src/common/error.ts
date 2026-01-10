export abstract class AppError extends Error {
  abstract statusCode: number
  abstract code: string

  constructor(message: string) {
    super(message)
  }
}

export class NotFoundError extends AppError {
  statusCode = 404
  code = 'NOT_FOUND'
}

export class BadRequestError extends AppError {
  statusCode = 400
  code = 'BAD_REQUEST'
}

export class UnauthorizedError extends AppError {
  statusCode = 401
  code = 'UNAUTHORIZED'
}

export class ForbiddenError extends AppError {
  statusCode = 403
  code = 'FORBIDDEN'
}

export class ConflictError extends AppError {
  statusCode = 409
  code = 'CONFLICT'
}
