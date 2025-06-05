import {sendEmail} from "../utils/sendEmail.js"
import {generateVerificationOtpEmailTemplate} from "./emailTemplate.js";


export async function sendVerificationCode(verificationCode,email){
    try{
        const message=generateVerificationOtpEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject:"verification Code (Bookworm Library Management System)",
            message,
        });

       return { success: true };

    }catch(error){
        console.error("Email sending error:", error); 
    }
}