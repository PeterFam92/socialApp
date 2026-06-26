import jwt, { JwtPayload } from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";
import { RoleEnum, signatureEnum ,tokenTypeEnum} from "../enums/auth.enum";

import{v4 as uuid}from "uuid"
import { ACCESS_TOKEN_SECRET_ADMIN, ACCESS_TOKEN_SECRET_USER, REFRESH_TOKEN_SECRET_ADMIN, REFRESH_TOKEN_SECRET_USER ,ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION} from "../../config/config.service";
import authService from "../../modules/auth/auth.service";

import { BadRequestException, NotFoundException, UnauthorizedRequestException } from "../response/error.response";
import { userRepository } from "../../db/repositories/user.repo";
import { HUserDocument, userModel } from "../../db/models/user.model";
import { get, revokeTokenKey } from "../../db/redis.service";

export interface customJwtPayload extends JwtPayload{
    id:string;
    jti:string
}


export class tokenService{
    private readonly _userRepo=new userRepository(userModel)
    constructor(){}
    sign= async(payload:object,secret:string,options?:SignOptions):Promise<string>=>{
        return jwt.sign(payload,secret,options)
    }


    verify = async (token:string,secret:string):Promise<customJwtPayload> =>{
        return jwt.verify(token,secret) as customJwtPayload

    }

    getSignature = ({ signatureLevel = signatureEnum.USER } ) => {
        const signature: { accessSignature: string; refreshSignature: string } = {
            accessSignature: "",
            refreshSignature: ""
        };
        switch(signatureLevel)
        {
            case signatureEnum.ADMIN:
                signature.accessSignature= ACCESS_TOKEN_SECRET_ADMIN as string
                signature.refreshSignature= REFRESH_TOKEN_SECRET_ADMIN  as string
                break;
           case signatureEnum.USER:
            signature.accessSignature=ACCESS_TOKEN_SECRET_USER as string
            signature.refreshSignature=REFRESH_TOKEN_SECRET_USER as string

            break;
            default:
                 signature.accessSignature=ACCESS_TOKEN_SECRET_USER as string
            signature.refreshSignature=REFRESH_TOKEN_SECRET_USER as string
            break


        }
        return signature
    };

    getNewCredentials= async(user:{_id:string;role:RoleEnum})=>{
        const signature = await this.getSignature({signatureLevel:user.role !=RoleEnum.ADMIN? signatureEnum.USER:
            signatureEnum.ADMIN
        });

        const jwtid=uuid();
        const accessToken= await this.sign({id:user._id,jti:jwtid},
            signature.accessSignature,
            {expiresIn:Number(ACCESS_TOKEN_EXPIRATION)}
        );


      const refreshToken= await this.sign({id:user._id,jti:jwtid},
        signature.refreshSignature,
        {expiresIn:Number(REFRESH_TOKEN_EXPIRATION)}
    )
return {accessToken,refreshToken}
    };
    decodedToken=async ({authorization,
        tokenType=tokenTypeEnum.ACCESS}:{
            authorization:string;
            tokenType?:tokenTypeEnum}):Promise<{user:HUserDocument;decoded:customJwtPayload}>=>
                {
                if(!authorization)throw new BadRequestException("authorization header is missing")
                    const[Bearer,token]=authorization.split(" ")||[]
                if(!Bearer||!token)
                    throw new BadRequestException("invalid token format")
      let signature = await this.getSignature({signatureLevel:Bearer==="Admin"?signatureEnum.ADMIN:
        signatureEnum.USER
      })  
const secret= tokenType===tokenTypeEnum.ACCESS?signature.accessSignature:signature.refreshSignature;
const decoded= await this.verify(token,secret);
const isRevoked =await get({

    key:revokeTokenKey({userId:decoded.id,jti:decoded.jti})})
    if(isRevoked)throw new UnauthorizedRequestException("token is revoked")
const user=await this._userRepo.findById({id:decoded.id})
if(!user) throw new NotFoundException("not registered account")
return {user ,decoded}

    }


}