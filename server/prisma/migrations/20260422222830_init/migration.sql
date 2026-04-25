-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "affectedPop" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "issueType" TEXT NOT NULL,
    "suggestedSol" TEXT NOT NULL,
    "sdgTag" TEXT,
    "rationale" TEXT,
    "authorName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
