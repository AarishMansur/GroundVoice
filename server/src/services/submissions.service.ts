import { prisma } from "../lib/prisma.js";

export type SubmissionFilters = {
  region?: string;
  issueType?: string;
};

export class SubmissionsService {
  static async findAll(filters: SubmissionFilters) {
    const where: any = {};

    if (filters.region) {
      where.region = {
        equals: filters.region,
        mode: "insensitive",
      };
    }

    if (filters.issueType) {
      where.issueType = {
        equals: filters.issueType,
        mode: "insensitive",
      };
    }

    return prisma.submission.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findById(id: string) {
    return prisma.submission.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    title: string;
    description: string;
    affectedPop: string;
    region: string;
    issueType: string;
    suggestedSol: string;
    authorName: string;
    sdgTag: string | null;
  }) {
    return prisma.submission.create({
      data: {
        ...data,
        rationale: null,
      },
    });
  }
}
