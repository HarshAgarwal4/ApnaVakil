import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.myGMAIL,
        pass: process.env.password
    }
})

async function sendMail(to, subject, text) {
    const mailOptions = {
        from: `"ApnaVakil" <${process.env.myGMAIL}>`,
        to: to,
        subject: subject,
        html: text,
    };
    try{
        await transporter.sendMail(mailOptions);
        return true;
    }catch(err){
        console.log(err);
        return false;
    }
}
export {sendMail}