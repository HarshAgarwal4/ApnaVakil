import { sendMail } from "./mail.js";

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

const otpStorage = new Map();

async function sendOTPEmail(email) {
    let otp = generateOTP();
    if(otpStorage.has(email)) otpStorage.delete(email);
    otpStorage.set(email , otp)
    setTimeout(() => {
        otpStorage.delete(email);
    }, 5*60*1000)
    console.log(otpStorage)
    try{
        let r = await sendMail(email , "OTP" , `<h1>Your OTP for Vakil is ${otp}</h1><p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>`);
        if(!r) return false;
        if(r) return true
    }
    catch(err){
        console.log(err);
        return false;
    }
}

function verifyOTP(email , otp){
    console.log(otpStorage)
    console.log(email , otp)
    console.log(otpStorage.get(email))
    console.log(otpStorage.get(email),otp)
    console.log(otpStorage.get(email)==otp)
    console.log(otpStorage.get(email)===otp)
    if(!otpStorage.has(email)) return false;
    let storedOTP = otpStorage.get(email);
    if(String(storedOTP) !== String(otp)) return false;
    otpStorage.delete(email);
    return true;
}

export { sendOTPEmail , verifyOTP }