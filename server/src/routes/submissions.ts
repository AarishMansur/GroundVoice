import { Router } from "express";

import {
  analyzeSubmissionReport,
  createSubmission,
  getSubmissionById,
  getSubmissions,
} from "../controllers/submissions.controller.js";

export const submissionsRouter = Router();

submissionsRouter.post("/analyze", analyzeSubmissionReport);
submissionsRouter.get("/", getSubmissions);
submissionsRouter.get("/:id", getSubmissionById);
submissionsRouter.post("/", createSubmission);
