import { Request, Response, NextFunction } from 'express';
export interface IError extends Error {
    statusCode: number;
    message: string;
    details?: any;
}
export declare class ApplicationError extends Error {
    statusCode: number;
    constructor(message: string, options?: ErrorOptions, statusCode?: number);
}
export declare class BadRequestException extends ApplicationError {
    constructor(message: string, options?: ErrorOptions);
}
export declare class NotFoundException extends ApplicationError {
    constructor(message: string, options?: ErrorOptions);
}
export declare class ConflictRequestException extends ApplicationError {
    constructor(message: string, options?: ErrorOptions);
}
export declare class ForbiddenRequestException extends ApplicationError {
    constructor(message: string, options?: ErrorOptions);
}
export declare class UnauthorizedRequestException extends ApplicationError {
    constructor(message: string, options?: ErrorOptions);
}
export declare const globalErrorHandler: (err: IError, req: Request, res: Response, next: NextFunction) => void;
