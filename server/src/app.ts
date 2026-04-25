import cors from "cors";
import express from "express";

import { config } from "./config.js";
import { healthRouter } from "./routes/health.js";
import { submissionsRouter } from "./routes/submissions.js";

export const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.get("/", (_request, response) => {
  response.json({
    name: "Ground Voice API",
    message: "Foundation ready for guided NGO health submissions.",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/submissions", submissionsRouter);
