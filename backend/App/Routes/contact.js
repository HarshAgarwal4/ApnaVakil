import express from "express";
import { contact } from "../controllers/contact.js";

const contactRouter = express.Router()

contactRouter.post('/contact' , contact)

export {contactRouter}