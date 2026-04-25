export interface Submission {
  id: string;
  title: string;
  description: string;
  affectedPop: string;
  region: string;
  issueType: string;
  suggestedSol: string;
  sdgTag: string | null;
  rationale: string | null;
  authorName: string;
  createdAt: Date;
}
