import express from "express";
import { SaveLawyer , fetchLawyer , UpdateLawyers, sendMessageToLawyer } from "../controllers/lawyers.js";
import { uploadTemp } from "../../../services/TempUpload.js";
const LawyerRouter = express.Router();

LawyerRouter.post('/createLawyer' , uploadTemp.single("image"), SaveLawyer)
LawyerRouter.post('/fetchLawyer' , fetchLawyer)
LawyerRouter.post('/updateLawyer' , UpdateLawyers)
LawyerRouter.post('/askLawyer' , sendMessageToLawyer)

export default LawyerRouter