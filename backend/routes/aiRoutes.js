import express from "express";
import multer from "multer";
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from "../controllers/aiController.js";
import protect from "../middlewares/authMiddleware.js";

const aiRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription);
aiRouter.post('/upload-resume', protect, upload.single('resume'), uploadResume);

export default aiRouter;