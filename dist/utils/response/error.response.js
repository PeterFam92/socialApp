"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.UnauthorizedRequestException = exports.ForbiddenRequestException = exports.ConflictRequestException = exports.NotFoundException = exports.BadRequestException = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    statusCode;
    constructor(message, options, statusCode = 400) {
        super(message, options);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
exports.ApplicationError = ApplicationError;
class BadRequestException extends ApplicationError {
    constructor(message, options) {
        super(message, options, 400);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends ApplicationError {
    constructor(message, options) {
        super(message, options, 404);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictRequestException extends ApplicationError {
    constructor(message, options) {
        super(message, options, 409);
    }
}
exports.ConflictRequestException = ConflictRequestException;
class ForbiddenRequestException extends ApplicationError {
    constructor(message, options) {
        super(message, options, 403);
    }
}
exports.ForbiddenRequestException = ForbiddenRequestException;
class UnauthorizedRequestException extends ApplicationError {
    constructor(message, options) {
        super(message, options, 401);
    }
}
exports.UnauthorizedRequestException = UnauthorizedRequestException;
const globalErrorHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        message: err.message || 'something went wrong', stack: err.stack,
        cause: err.cause,
    });
};
exports.globalErrorHandler = globalErrorHandler;
