import express from "express";
import { SaveLawyer , fetchLawyer , UpdateLawyers } from "../controllers/lawyers.js";
import { uploadTemp } from "../../../services/TempUpload.js";
const LawyerRouter = express.Router();

LawyerRouter.post('/createLawyer' , uploadTemp.single("image"), SaveLawyer)
LawyerRouter.post('/fetchLawyer' , fetchLawyer)
LawyerRouter.post('/updateLawyer' , UpdateLawyers)

export default LawyerRouter