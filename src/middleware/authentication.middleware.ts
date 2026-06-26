import { NextFunction,Request,Response } from "express";
import { RoleEnum, tokenTypeEnum } from "../utils/enums/auth.enum";
import { tokenService } from "../utils/services/token";
import { BadRequestException, ForbiddenRequestException } from "../utils/response/error.response";



export const authentication= ({tokenType=tokenTypeEnum.ACCESS})=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const tokenservice = new tokenService()
        if (!req.headers.authorization) throw new BadRequestException("authorization header is missing")

        const { user, decoded } = await tokenservice.decodedToken({
            authorization: req.headers.authorization,
            tokenType,
        })||{}
        req.user=user
        req.decoded=decoded
        return next()
    }
}




export const authorization= ({accessRole = []}: {accessRole?: RoleEnum[]})=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        if(!req.user.role||!accessRole.includes(req.user.role))
            throw new ForbiddenRequestException("forbidden request")
        
        return next()
    }
}