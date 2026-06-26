import {createTransport,Transporter} from "nodemailer";
import { user_Email, user_Password } from "../../config/config.service";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { BadRequestException } from "../response/error.response";

export const sendEmail = async (data:SMTPTransport.Options):Promise<any> =>{
  if(!data.html && !data.attachments && !data.text){
    throw new BadRequestException("missing email content")
  }

  const transporter:Transporter<SMTPTransport.SentMessageInfo,
  SMTPTransport.Options> = createTransport({
    service:"gmail",
    auth:{
      user:user_Email as string,
      pass:user_Password as string
    }
  } as SMTPTransport.Options)
const info =await transporter.sendMail({
  ...data,
  from:`"Academy"<${user_Email as string}`
})
}
