import { setuser, getUser } from "../../../services/auth.js";
import { comparePassword, hashPassword } from "../../../services/encryption.js";
import { sendOTPEmail, verifyOTP } from "../../../services/otp.js";
import dotenv from 'dotenv'
dotenv.config()
import userModel from "../models/user.js";

async function saveUser(req, res) {
    let { name, email, password, otp } = req.body;
    if (!name || !email || !password || !otp) {
        return res.send({ status: 7, msg: "Invalid fields" });
    }
    console.log(otp)
    try {
        let otpResult = verifyOTP(email, otp)
        console.log(otpResult)
        if (!otpResult) return res.send({ status: 10, msg: "Invalid OTP" });
        else {
            let obj = { name, email, password };
            const newUser = new userModel(obj)
            await newUser.save();
            return res.send({ status: 1, msg: "User created successfully" });
        }
    } catch (err) {
        console.log(err);
        if (err.code === 11000 && err.keyPattern.email) {
            return res.send({ status: 6, msg: "Email already exists" });
        }
        return res.send({ status: 0, msg: "Error in creating user" });
    }
}

async function login(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.send({ status: 7, msg: "Invalid fields" });
    }
    try {
        let findUser = await userModel.findOne({ email: email });
        if (!findUser) return res.send({ status: 5, msg: "User not found" });
        let isMatch = await comparePassword(password, findUser.password);
        if (!isMatch) return res.send({ status: 9, msg: "Incorrect password" });
        let token = await setuser(findUser)
        findUser.refreshToken = token;
        await findUser.save();
        console.log(process.env.production === "true")
        res.cookie('UID', token, {
            httpOnly: process.env.production === "true",
            secure: process.env.production === "true",
            sameSite: process.env.production === "true" ? 'none' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return res.send({ status: 1, msg: "Login successful" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Error in logging in" });
    }
}

async function fetchUser(req, res) {
    const token = req.cookies?.UID
    if (!token) return res.send({ status: 0, msg: "Not authenticated" });
    try {
        const payload1 = await getUser(token)
        const payload = await userModel.findById(payload1.id)
        console.log("Payload is", payload)
        if (!payload) return res.send({ status: 0, msg: "Not Authenticated" })
        res.send({ status: 1, data: payload })
    } catch (err) {
        res.send({ status: 2, msg: "Invalid Token" })
    }
}

async function logout(req, res) {
    try {
        let token = req.cookies?.UID;
        if (!token) return res.send({ status: 1, msg: "Logged out successfully" });
        let user = await getUser(token)
        let u = await userModel.findById(user.id)
        if (!u) return res.send({ status: 0, msg: "error" });
        if (u) {
            u.refreshToken = null
            await u.save()
        }
        res.clearCookie('UID', {
            httpOnly: process.env.production === "true",
            secure: process.env.production === "true",
            sameSite: process.env.production === "true" ? 'none' : 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        req.user = null
        return res.send({ status: 1, msg: "Logged out successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Error in logging out" });
    }
}

async function fgtpwd(req, res) {
    let { email, password, otp } = req.body;
    if (!email || !password || !otp) {
        return res.send({ status: 7, msg: "Invalid fields" });
    }
    try {
        let otpResult = verifyOTP(email, otp)
        if (!otpResult) return res.send({ status: 10, msg: "Invalid OTP" });
        let newPassword = await hashPassword(password)
        let user = await userModel.findOneAndUpdate({ email: email },
            {
                $set: { password: newPassword }
            },
            {
                new: true
            }
        )
        if (!user) return res.send({ status: 5, msg: "User not found" })
        return res.send({ status: 1, msg: "Password changed successfully" })
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Error in changing password" });
    }
}

async function sendOtpToEmail(req, res) {
    let { email } = req.body;
    console.log(email);
    if (!email) return res.send({ status: 7, msg: "Invalid fields" });
    try {
        let r = await sendOTPEmail(email);
        if (!r) return res.send({ status: 0, msg: "Error in sending OTP" });
        if (r) return res.send({ status: 1, msg: "OTP sent successfully" });
    } catch (err) {
        console.log(err);
        return res.send({ status: 0, msg: "Error in sending OTP" });
    }
}

export { saveUser, login, fetchUser, logout, sendOtpToEmail, fgtpwd };