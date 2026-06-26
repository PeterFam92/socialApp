import { EventEmitter } from "node:events";
import Mail from "nodemailer/lib/mailer";
import { template } from "../email/generateHtml";
import { sendEmail } from "../email/email.utils";

export const emailEvents = new EventEmitter()

interface IEmail extends Mail.Options{
    otp:string
    username:string
}

emailEvents.on("confirmEmail", async(data:IEmail)=>{
    try {
        data.subject="confirm your email"
        data.html=template(data.otp,data.username,data.subject)
        await sendEmail(data)
    } catch (error) {
        console.log(`fail to send email`,error);
        
        
    }
})