import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './App/Users/Routes/user.js'
import { chatRouter } from './App/Users/Routes/Chatbot.js';
import { PaymentRouter } from './App/Users/Routes/payment.js';
import { authAndPayment } from './middleware/auth1.js';
import { contactRouter } from './App/Users/Routes/contact.js';
import { isAdmin } from './middleware/admin.js';
import { adminUserRoutes } from './App/Admin/Routes/user.js';
import { adminPaymentsRoutes } from './App/Admin/Routes/payment.js';
import { adminContactsRoutes } from './App/Admin/Routes/contact.js';
import LawyerRouter from './App/Admin/Routes/lawyers.js';
import { draftRoutes } from './App/Users/Routes/Drafts.js';

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
// DEVELOPMENT
// app.use(cors({
//     origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
//     credentials: true
// }))
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(authAndPayment)
app.use(isAdmin)

app.get('/', (req, res) => {
    res.send("hello world")
})
app.use('/', userRouter);
app.use('/' , chatRouter);
app.use('/' , PaymentRouter)
app.use('/' , contactRouter)
app.use('/' , adminUserRoutes)
app.use('/' , adminPaymentsRoutes)
app.use('/' , adminContactsRoutes)
app.use('/' , LawyerRouter)
app.use('/' , draftRoutes)

mongoose.connect(process.env.DB_URL, {
    dbName: "Vakil",
}).then(() => {
    console.log("DB connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})