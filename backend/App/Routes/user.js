import express from 'express';
import { saveUser , login , fetchUser , sendOtpToEmail , logout , fgtpwd} from '../controllers/user.js';
const userRouter = express.Router();

userRouter.post('/register' , saveUser)
userRouter.post('/login' , login)
userRouter.get('/me' , fetchUser)
userRouter.post('/logout' , logout)
userRouter.post('/sendotp' , sendOtpToEmail)
userRouter.post('/fgtpwd', fgtpwd)

export {userRouter}