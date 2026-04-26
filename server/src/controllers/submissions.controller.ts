import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { analyzeSubmission } from "../lib/ai.js";
// @ts-ignore
import type { Submission } from "../types/submission.js";

const allowedSdgTags = [
  "Mental Health",
  "Healthcare Access",
  "Disease Prevention",
  "Maternal & Child Health",
  "Health Workforce",
] as const;

type SdgTag = (typeof allowedSdgTags)[number];

type SubmissionPayload = {
  title?: string;
  description?: string;
  affectedPop?: string;
  region?: string;
  issueType?: string;
  suggestedSol?: string;
  authorName?: string;
};

function isAllowedSdgTag(value: string): value is SdgTag {
  return allowedSdgTags.includes(value as SdgTag);
}

function getSubmissionCategory(issueType: string) {
  return isAllowedSdgTag(issueType) ? issueType : "Healthcare Access";
}

export async function getSubmissions(request: Request, response: Response) {
  try {
    const regionFilter = typeof request.query.region === "string" ? request.query.region.trim() : "";
    const issueTypeFilter =
      typeof request.query.issueType === "string" ? request.query.issueType.trim() : "";

    const filters: any = {};
    if (regionFilter) {
      filters.region = {
        equals: regionFilter,
        mode: "insensitive",
      };
    }
    if (issueTypeFilter) {
      filters.issueType = {
        equals: issueTypeFilter,
        mode: "insensitive",
      };
    }

    const submissions = await prisma.submission.findMany({
      where: filters,
      orderBy: {
        createdAt: "desc",
      },
    });

    const stats = {
      totalReports: submissions.length,
      regionCount: new Set(submissions.map((submission: Submission) => submission.region)).size,
    };

    response.json({
      submissions,
      stats,
      filters: {
        region: regionFilter || null,
        issueType: issueTypeFilter || null,
      },
    });
  } catch (error) {
    console.error("Failed to load feed", error);
    response.status(500).json({
      message: "We could not load the public feed right now. Please try again in a moment.",
    });
  }
}

export async function getSubmissionById(request: Request, response: Response) {
  try {
    const submissionId =
      typeof request.params.id === "string" ? request.params.id : request.params.id?.[0];

    if (!submissionId) {
      response.status(400).json({
        message: "A submission id is required.",
      });
      return;
    }

    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submission) {
      response.status(404).json({
        message: "This report could not be found.",
      });
      return;
    }

    response.json({ submission });
  } catch (error) {
    console.error("Failed to load submission", error);
    response.status(500).json({
      message: "We could not load this report right now. Please try again in a moment.",
    });
  }
}

export async function createSubmission(request: Request, response: Response) {
  try {
    const payload = request.body as SubmissionPayload;
    const title = payload.title?.trim() ?? "";
    const description = payload.description?.trim() ?? "";
    const affectedPop = payload.affectedPop?.trim() ?? "";
    const region = payload.region?.trim() ?? "";
    const issueType = payload.issueType?.trim() ?? "";
    const suggestedSol = payload.suggestedSol?.trim() ?? "";
    const authorName = payload.authorName?.trim() ?? "";

    if (
      !title ||
      !description ||
      !affectedPop ||
      !region ||
      !issueType ||
      !suggestedSol ||
      !authorName
    ) {
      response.status(400).json({
        message: "Every report field is required before a submission can be saved.",
      });
      return;
    }


    const aiAnalysis = await analyzeSubmission(description).catch(() => ({
      sitrep: null,
      severity: 5,
    }));

    const submission = await prisma.submission.create({
      data: {
        title,
        description,
        affectedPop,
        region,
        issueType,
        suggestedSol,
        authorName,
        sdgTag: getSubmissionCategory(issueType),
        rationale: aiAnalysis.sitrep,
        severity: aiAnalysis.severity,
      },
    });

    response.status(201).json({ submission });
  } catch (error) {
    console.error("Failed to create submission", error);
    response.status(500).json({
      message: "We could not save this report right now. Please try again in a moment.",
    });
  }
}

export async function analyzeSubmissionReport(request: Request, response: Response) {
  try {
    const { description } = request.body;

    if (!description) {
      response.status(400).json({
        message: "Report description is required for analysis.",
      });
      return;
    }

    const aiAnalysis = await analyzeSubmission(description);

    response.json({ aiReport: aiAnalysis.sitrep, severity: aiAnalysis.severity });
  } catch (error) {
    console.error("AI Analysis failed", error);
    response.status(500).json({
      message: "AI could not analyze the report at this time.",
    });
  }
}
