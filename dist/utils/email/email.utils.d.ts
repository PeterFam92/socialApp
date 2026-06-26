import SMTPTransport from "nodemailer/lib/smtp-transport";
export declare const sendEmail: (data: SMTPTransport.Options) => Promise<any>;
