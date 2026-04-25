import { Submission } from "../../types/report";
import StructuredPreview from "./StructuredPreview";

type SubmissionSuccessProps = {
  onReset: () => void;
  onViewReport: () => void;
  onViewFeed: () => void;
  submission: Submission;
};

function SubmissionSuccess({ onReset, onViewFeed, onViewReport, submission }: SubmissionSuccessProps) {
  return (
    <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <article className="self-start rounded-4xl border border-white/70 bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">
          Submission complete
        </p>
        <h2 className="mt-4 text-3xl font-semibold">Your Ground Voice statement is saved.</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          The report has been saved, classified into an SDG-aligned health category, and is ready for the
          public feed.
        </p>

        <div className="mt-8 grid gap-4">
          {[
          { label: "Region", value: submission.region },
          { label: "Issue type", value: submission.issueType },
            { label: "SDG category", value: submission.sdgTag ?? submission.issueType },
            { label: "Reporter", value: submission.authorName },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            className="flex-1 rounded-2xl bg-sky-400 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-300 hover:shadow-lg hover:shadow-sky-400/20"
            onClick={onReset}
            type="button"
          >
            New report
          </button>
          <button
            className="flex-1 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
            onClick={onViewFeed}
            type="button"
          >
            View feed
          </button>
          <button
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400"
            onClick={onViewReport}
            type="button"
          >
            View full report
          </button>
        </div>
      </article>

      <StructuredPreview
        title={submission.title}
        region={submission.region}
        issueType={submission.issueType}
        description={submission.description}
        affectedPop={submission.affectedPop}
        suggestedSol={submission.suggestedSol}
        authorName={submission.authorName}
        sdgTag={submission.sdgTag}
      />
    </section>
  );
}

export default SubmissionSuccess;
