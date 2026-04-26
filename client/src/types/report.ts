export type IssueType =
  | "Mental Health"
  | "Healthcare Access"
  | "Disease Prevention"
  | "Maternal & Child Health"
  | "Health Workforce";

export type FormValues = {
  title: string;
  region: string;
  issueType: IssueType | "";
  description: string;
  affectedPop: string;
  suggestedSol: string;
  authorName: string;
};

export type Submission = FormValues & {
  id: string;
  sdgTag: string | null;
  rationale: string | null;
  severity: number;
  createdAt: string;
};

export type SubmissionResponse = {
  submission: Submission;
};

export type SubmissionDetailResponse = {
  submission: Submission;
};

export type FeedStats = {
  totalReports: number;
  regionCount: number;
};

export type FeedFilters = {
  region: string | null;
  issueType: string | null;
};

export type FeedResponse = {
  submissions: Submission[];
  stats: FeedStats;
  filters: FeedFilters;
};

export type StepKey = keyof Pick<
  FormValues,
  "title" | "region" | "issueType" | "description" | "affectedPop" | "suggestedSol" | "authorName"
>;

export type StepDefinition = {
  id: number;
  title: string;
  caption: string;
  fields: StepKey[];
};
