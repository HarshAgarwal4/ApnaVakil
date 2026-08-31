import express from "express";
import {
  SaveLawyer,
  fetchLawyer,
  getLawyerById,
  UpdateLawyers,
  getLawyerProfile,
  updateLawyerProfile,
  getLawyerRequests,
  updateRequestStatus,
  sendMessageToLawyer,
  getUserConnections
} from "../controllers/lawyers.js";
import { uploadTemp } from "../../../services/TempUpload.js";
import { isLoggedIn } from "../../../middleware/auth.js";

const LawyerRouter = express.Router();

// Public & Client Endpoints
LawyerRouter.post('/createLawyer', uploadTemp.single("image"), SaveLawyer);
LawyerRouter.post('/fetchLawyer', fetchLawyer);
LawyerRouter.get('/fetchLawyer', fetchLawyer);
LawyerRouter.get('/lawyer/:id', getLawyerById);
LawyerRouter.post('/lawyer/:id', getLawyerById);
LawyerRouter.post('/updateLawyer', UpdateLawyers);
LawyerRouter.post('/askLawyer', sendMessageToLawyer);

// Client Connection Inquiries Management
LawyerRouter.get('/user-connections', isLoggedIn, getUserConnections);
LawyerRouter.post('/user-connections', isLoggedIn, getUserConnections);

// Lawyer Panel Endpoints (Protected by isLoggedIn)
LawyerRouter.get('/lawyer-me', isLoggedIn, getLawyerProfile);
LawyerRouter.post('/lawyer-me', isLoggedIn, getLawyerProfile);
LawyerRouter.post('/lawyer-update-profile', isLoggedIn, uploadTemp.single("image"), updateLawyerProfile);
LawyerRouter.get('/lawyer-requests', isLoggedIn, getLawyerRequests);
LawyerRouter.post('/lawyer-requests', isLoggedIn, getLawyerRequests);
LawyerRouter.post('/lawyer-request-status', isLoggedIn, updateRequestStatus);

export default LawyerRouter;