import { HydratedDocument, Schema}from "mongoose";
import mongoose from "mongoose";
import{GenderEnum, RoleEnum} from "../utils/enums/auth.enum";


export interface IUser{
    firstName:string;
    lastName:string;
    username?:string;
    email:string;
    confirmEmailOtp?:string;
    confirmEmail?:Date;
    password:string;
    resetPasswordOtp?:string;
    phone?:string;
    address?:string;
    gender:GenderEnum;
    role?:RoleEnum;
    createdAt:Date;
    updatedAt?:Date;
}

export const userSchema=new Schema<IUser>(
    {
    firstName:{type:String,required:true,trim:true,minlength:2,maxlength:25},
    lastName:{type:String,required:true,trim:true,minlength:2,maxlength:25},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    confirmEmailOtp:{type:String},
    confirmEmail:{type:Date},
    resetPasswordOtp:{type:String},
    phone:{type:String},
    address:{type:String},
    gender:{type:String,enum:Object.values(GenderEnum),default:GenderEnum.MALE},
    role:{type:String,enum:Object.values(RoleEnum),default:RoleEnum.USER},
    },
    {timestamps:true,
        toJSON:{virtuals:true},
        toObject:{virtuals:true}})




        userSchema.virtual("username").set(function(value:string){
            const[firstName,lastName]=value.split(" ")||[];
            this.set({firstName,lastName});}).get(function(){
                return `${this.firstName} ${this.lastName}`;
            })


            export const userModel=mongoose.model<IUser>("User",userSchema)
            export type HUserDocument=HydratedDocument<IUser>