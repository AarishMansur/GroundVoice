import { useEffect, useState } from "react";

import { API_BASE_URL } from "../../lib/reportForm";
import { formatSubmissionDate } from "../../lib/submission";
import { Submission, SubmissionDetailResponse } from "../../types/report";
import StructuredPreview from "../report-builder/StructuredPreview";
import LoadingSpinner from "../shared/LoadingSpinner";

type ReportDetailViewProps = {
  onCreateReport: () => void;
  onViewFeed: () => void;
  submissionId: string;
};

function ReportDetailView({
  onCreateReport,
  onViewFeed,
  submissionId,
}: ReportDetailViewProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSubmission() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/submissions/${submissionId}`);
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          throw new Error("The server returned HTML instead of JSON. Check the API route and dev server.");
        }

        const payload = (await response.json()) as SubmissionDetailResponse | { message?: string };
        const errorMessage = "message" in payload ? payload.message : undefined;

        if (!response.ok || !("submission" in payload)) {
          throw new Error(errorMessage ?? "We could not load this report right now.");
        }

        if (!isActive) {
          return;
        }

        setSubmission(payload.submission);
      } catch (fetchError) {
        if (!isActive) {
          return;
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while loading this report.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadSubmission();

    return () => {
      isActive = false;
    };
  }, [submissionId]);

  if (isLoading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white/85 p-10 text-center text-sm text-slate-600 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <LoadingSpinner label="Loading full report..." />
      </section>
    );
  }

  if (error || !submission) {
    return (
      <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <p className="text-lg font-semibold text-rose-900">We hit a problem loading this report.</p>
        <p className="mt-3 text-sm leading-7">{error ?? "The report could not be loaded."}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-full bg-sky-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
            onClick={onViewFeed}
            type="button"
          >
            Back to public feed
          </button>
          <button
            className="rounded-full border border-rose-300 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-white/50"
            onClick={onCreateReport}
            type="button"
          >
            Submit a new report
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="self-start rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.2)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Full report</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em]">{submission.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Review the complete submission and keep the report ready for judges in a polished full-report
            view.
          </p>

          <div className="mt-8 grid gap-4">
            <DetailCard label="Region" value={submission.region} />
            <DetailCard label="Issue Type" value={submission.issueType} />
            <DetailCard label="SDG Sub-goal" value={submission.sdgTag ?? "General Health"} />
            <DetailCard label="Date" value={formatSubmissionDate(submission.createdAt)} />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/8"
              onClick={onViewFeed}
              type="button"
            >
              Back to public feed
            </button>
            <button
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/8"
              onClick={onCreateReport}
              type="button"
            >
              Submit another report
            </button>
          </div>
        </article>

        <StructuredPreview
          affectedPop={submission.affectedPop}
          authorName={submission.authorName}
          description={submission.description}
          issueType={submission.issueType}
          region={submission.region}
          sdgTag={submission.sdgTag}
          suggestedSol={submission.suggestedSol}
          title={submission.title}
        />
      </section>
    </>
  );
}

type DetailCardProps = {
  label: string;
  value: string;
};

function DetailCard({ label, value }: DetailCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

export default ReportDetailView;
