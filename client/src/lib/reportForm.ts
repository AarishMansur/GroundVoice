import { FormValues, IssueType, StepDefinition, StepKey } from "../types/report";

const rawBackendUrl = (import.meta.env.VITE_BACKEND_API || "/api").replace(/\/$/, "");
export const API_BASE_URL = rawBackendUrl.endsWith("/api") ? rawBackendUrl : `${rawBackendUrl}/api`;

export const regions = [
  "Africa",
  "Asia-Pacific",
  "Europe",
  "Latin America",
  "Middle East",
  "North America",
  "Global / Multi-region",
] as const;

export const issueTypes: IssueType[] = [
  "Mental Health",
  "Healthcare Access",
  "Disease Prevention",
  "Maternal & Child Health",
  "Health Workforce",
];

export const steps: StepDefinition[] = [
  {
    id: 1,
    title: "Issue basics",
    caption: "Name the issue, location, and health category.",
    fields: ["title", "region", "issueType"],
  },
  {
    id: 2,
    title: "Describe the issue",
    caption: "Explain what is happening on the ground.",
    fields: ["description"],
  },
  {
    id: 3,
    title: "Affected population",
    caption: "Describe who is impacted and why this matters.",
    fields: ["affectedPop"],
  },
  {
    id: 4,
    title: "Recommendation",
    caption: "Propose a practical solution and identify the reporting NGO.",
    fields: ["suggestedSol", "authorName"],
  },
  {
    id: 5,
    title: "Review",
    caption: "Check the statement before submitting it.",
    fields: [],
  },
];

export const initialValues: FormValues = {
  title: "",
  region: "",
  issueType: "",
  description: "",
  affectedPop: "",
  suggestedSol: "",
  authorName: "",
};

export function validateField(field: StepKey, values: FormValues) {
  const trimmedValue = values[field].trim();

  switch (field) {
    case "title":
      return trimmedValue.length >= 8 ? null : "Give the issue a clear title of at least 8 characters.";
    case "region":
      return trimmedValue ? null : "Choose the region most affected by this issue.";
    case "issueType":
      return trimmedValue ? null : "Select the closest issue type.";
    case "description":
      return trimmedValue.length >= 120
        ? null
        : "Add more detail so the report clearly explains what is happening.";
    case "affectedPop":
      return trimmedValue.length >= 40
        ? null
        : "Describe the affected population in a little more detail.";
    case "suggestedSol":
      return trimmedValue.length >= 40
        ? null
        : "Provide a practical recommendation with at least a few sentences.";
    case "authorName":
      return trimmedValue.length >= 3 ? null : "Add the NGO or author name.";
    default:
      return null;
  }
}

export function inputClassName(error?: string) {
  return `w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 ${
    error ? "border-rose-300 ring-rose-100" : "border-slate-200 focus:ring-sky-100"
  }`;
}
