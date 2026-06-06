import{Request, Response,NextFunction} from 'express';

export interface IError extends Error{
    statusCode: number;
    message: string;
    details?: any;
}

export class ApplicationError extends Error{
    constructor(message:string,options?:ErrorOptions ,public statusCode:number=400){
        super(message,options);
        this.name=this.constructor.name;
    }

}


export class BadRequestException extends ApplicationError{
    constructor(message:string,options?:ErrorOptions){
        super(message,options,400);
    } }      


    
export class NotFoundException extends ApplicationError{
    constructor(message:string,options?:ErrorOptions){
        super(message,options,404);
    } } 

    
export class ConflictRequestException extends ApplicationError{
    constructor(message:string,options?:ErrorOptions){
        super(message,options,409);
    } } 

    
export class ForbiddenRequestException extends ApplicationError{
    constructor(message:string,options?:ErrorOptions){
        super(message,options,403);
    } } 

    
export class UnauthorizedRequestException extends ApplicationError{
    constructor(message:string,options?:ErrorOptions){
        super(message,options,401);
    } } 


    export const globalErrorHandler=(err:IError,req:Request,res:Response,next:NextFunction)=>{
        res.status(err.statusCode || 500).json({
            message: err.message || 'something went wrong',stack: err.stack,
            cause:err.cause,
        });
    }