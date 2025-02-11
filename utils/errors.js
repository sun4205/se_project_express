const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const CONFLICT = 409;
const FORBIDDEN = 403;


class BadRequestError extends Error {
  constructor(message){
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message){
    super(message);
    this.statusCode = 401;
  }
}

class NotFoundError extends Error {
  constructor(message){
    super(message);
    this.statusCode = 404;
  }
}

class ForbiddenError extends Error {
  constructor(message){
    super(message);
    this.statusCode = 403;
  }
}

class ConflictError extends Error {
  constructor(message){
    super(message);
    this.statusCode = 409;
  }
}

class InternalServerError extends Error {
  constructor(message){
    super(message);
    this.statusCode = 500;
  }
}








module.exports = {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
  FORBIDDEN,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
  InternalServerError,
};
