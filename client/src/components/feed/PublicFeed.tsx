import { useEffect, useState } from "react";

import { API_BASE_URL, issueTypes, regions } from "../../lib/reportForm";
import { formatSubmissionDate } from "../../lib/submission";
import { FeedResponse, Submission } from "../../types/report";
import LoadingSpinner from "../shared/LoadingSpinner";
import HealthMap from "./HealthMap";

type ViewMode = "list" | "map";

type PublicFeedProps = {
  onCreateReport: () => void;
  onViewReport: (submissionId: string) => void;
};

type FilterState = {
  region: string;
  issueType: string;
};

const initialFilters: FilterState = {
  region: "",
  issueType: "",
};

function buildFeedUrl(filters: FilterState) {
  const params = new URLSearchParams();

  if (filters.region) {
    params.set("region", filters.region);
  }

  if (filters.issueType) {
    params.set("issueType", filters.issueType);
  }

  const query = params.toString();
  return `${API_BASE_URL}/submissions${query ? `?${query}` : ""}`;
}

function PublicFeed({ onCreateReport, onViewReport }: PublicFeedProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState({ totalReports: 0, regionCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  useEffect(() => {
    let isActive = true;

    async function loadFeed() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(buildFeedUrl(filters));
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          throw new Error("The server returned HTML instead of JSON. Check the API route and dev server.");
        }

        const payload = (await response.json()) as FeedResponse | { message?: string };
        const errorMessage = "message" in payload ? payload.message : undefined;

        if (!response.ok || !("submissions" in payload)) {
          throw new Error(errorMessage ?? "We could not load the public feed right now.");
        }

        if (!isActive) {
          return;
        }

        setSubmissions(payload.submissions);
        setStats(payload.stats);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while loading the feed.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadFeed();

    return () => {
      isActive = false;
    };
  }, [filters]);

  return (
    <section className="grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8">
        <article className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950">
            Public feed of NGO health submissions
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Browse recent reports, filter by region or issue type, and surface the structured health
            category assigned during submission.
          </p>

          <p className="mt-6 text-sm font-medium text-slate-700">
            {stats.totalReports} reports submitted across {stats.regionCount} regions
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StatCard label="Reports in view" value={String(stats.totalReports)} />
            <StatCard label="Regions represented" value={String(stats.regionCount)} />
          </div>


          <div className="mt-8 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">View</span>
            <div className="relative flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`relative z-10 flex items-center gap-2 rounded-xl px-5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ${viewMode === "list"
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`relative z-10 flex items-center gap-2 rounded-xl px-5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ${viewMode === "map"
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-950/20"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                Health Map
              </button>
            </div>
          </div>
        </article>

        {isLoading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-10 text-center text-sm text-slate-500 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <LoadingSpinner label="Loading the latest reports..." />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            {error}
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-lg font-semibold text-slate-950">Be the first to submit a report.</p>
            <p className="mt-3 text-sm text-slate-600">
              Once the first Ground Voice statement is published, it will appear here with its category and
              submission details.
            </p>
          </div>
        ) : viewMode === "map" ? (
          <HealthMap submissions={submissions} onViewReport={onViewReport} />
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {submissions.map((submission) => (
              <article
                key={submission.id}
                className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
                      {submission.region}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                      {submission.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={submission.severity} />
                    <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {formatSubmissionDate(submission.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-sky-50 px-3 py-1 font-medium text-sky-900">
                    {submission.issueType}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-900">
                    {submission.sdgTag ?? "Fallback tag pending"}
                  </span>
                </div>

                <FeedSection body={submission.description} title="What is happening" />
                <FeedSection body={submission.affectedPop} title="Affected population" />
                <FeedSection body={submission.suggestedSol} title="Recommended solution" />

                <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Reported by <span className="text-slate-900 font-semibold">{submission.authorName}</span>
                  </p>
                  <button
                    className="whitespace-nowrap w-fit self-end rounded-full bg-slate-950 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-950/10 sm:self-auto"
                    onClick={() => onViewReport(submission.id)}
                    type="button"
                  >
                    View full report
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <article className="sticky top-10 self-start rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.14)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Filters</p>
        <div className="mt-6 grid gap-4">
          <label className="text-sm">
            <span className="mb-2 block text-slate-300">Region</span>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-sky-300"
              onChange={(event) =>
                setFilters((current) => ({ ...current, region: event.target.value }))
              }
              value={filters.region}
            >
              <option className="text-slate-900" value="">All regions</option>
              {regions.map((region) => (
                <option key={region} className="text-slate-900" value={region}>
                  {region}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-2 block text-slate-300">Issue type</span>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-sky-300"
              onChange={(event) =>
                setFilters((current) => ({ ...current, issueType: event.target.value }))
              }
              value={filters.issueType}
            >
              <option className="text-slate-900" value="">All issue types</option>
              {issueTypes.map((issueType) => (
                <option key={issueType} className="text-slate-900" value={issueType}>
                  {issueType}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-full bg-sky-300 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-200 hover:shadow-lg hover:shadow-sky-400/20"
            onClick={() => setFilters(initialFilters)}
            type="button"
          >
            Reset filters
          </button>
          <button
            className="rounded-full border border-white/15 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/8"
            onClick={onCreateReport}
            type="button"
          >
            Submit a report
          </button>
        </div>
      </article>
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</p>
    </div>
  );
}

type FeedSectionProps = {
  title: string;
  body: string;
};

function FeedSection({ title, body }: FeedSectionProps) {
  return (
    <section className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700">{body}</p>
    </section>
  );
}

function SeverityBadge({ severity }: { severity: number }) {
  const getSeverityConfig = (s: number) => {
    if (s >= 8) return { label: "Critical", bg: "bg-rose-100", text: "text-rose-700", dot: "bg-rose-500" };
    if (s >= 5) return { label: "Elevated", bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
    return { label: "Monitored", bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500" };
  };

  const config = getSeverityConfig(severity);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${config.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label} ({severity})
    </span>
  );
}

export default PublicFeed;
