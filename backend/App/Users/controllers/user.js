import { setuser, getUser } from "../../../services/auth.js";
import { comparePassword, hashPassword } from "../../../services/encryption.js";
import { sendOTPEmail, verifyOTP } from "../../../services/otp.js";
import dotenv from 'dotenv'
dotenv.config()
import userModel from "../models/user.js";
import lawyerModel from "../../Admin/models/lawyers.js";
import { redis } from "../../../services/redis.js";

async function saveUser(req, res) {
    let { name, email, password, otp, agree, isLawyer, role } = req.body;
    if (!name || !email || !password || !otp) {
        return res.send({ status: 7, msg: "Invalid fields" });
    }
    console.log(otp)
    try {
        let otpResult = verifyOTP(email, otp)
        console.log(otpResult)
        if (!otpResult) return res.send({ status: 10, msg: "Invalid OTP" });
        else {
            const userRole = (isLawyer || role === "lawyer") ? "lawyer" : "user";
            let obj = {
                name,
                email,
                password,
                role: userRole,
                agree: agree !== undefined ? Boolean(agree) : true
            };
            const newUser = new userModel(obj)
            let token = await setuser(newUser)
            newUser.refreshToken = token
            await newUser.save();

            // If user signed up as lawyer, create an initial lawyer entry
            if (userRole === "lawyer") {
                try {
                    let existingLawyer = await lawyerModel.findOne({ email });
                    if (!existingLawyer) {
                        const newLawyer = new lawyerModel({
                            userId: newUser._id,
                            name,
                            email,
                            phone: "",
                            desc: `Advocate ${name}, verified legal professional available for consultation.`,
                            categories: ["Civil Law", "Corporate Law", "Litigation"],
                            speciality: "Advocate & Legal Advisor",
                            experience: "5+ Years",
                            fee: "₹1,500 / consultation",
                            verified: true
                        });
                        await newLawyer.save();
                    }
                } catch (e) {
                    console.log("Error creating initial lawyer record:", e);
                }
            }

            await redis.set(`user:${newUser._id}`, JSON.stringify(newUser))
            res.cookie('UID', token, {
                httpOnly: process.env.production === "true",
                secure: process.env.production === "true",
                sameSite: process.env.production === "true" ? 'none' : 'Lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            return res.send({ status: 1, msg: "User created successfully", role: userRole });
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
        await redis.set(`user:${findUser._id}`, JSON.stringify(findUser))
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
        if (req.user) return res.send({ status: 1, data: req.user })
    }
    catch (err) {
        return res.send({ status: 0 })
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
        let a = await redis.del(`user:${user.id}`)
        console.log(a)
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