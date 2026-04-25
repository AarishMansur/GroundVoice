type StructuredPreviewProps = {
  title: string;
  region: string;
  issueType: string;
  description: string;
  affectedPop: string;
  suggestedSol: string;
  authorName: string;
  sdgTag?: string | null;
};

function StructuredPreview({
  title,
  region,
  issueType,
  description,
  affectedPop,
  suggestedSol,
  authorName,
  sdgTag,
}: StructuredPreviewProps) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">
          Civil society health statement
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">{title || "Untitled issue statement"}</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">{region || "Region pending"}</span>
          <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-900">{issueType}</span>
          {sdgTag ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-900">
              SDG category: {sdgTag}
            </span>
          ) : null}
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-900">
            Reported by {authorName || "NGO pending"}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <PreviewSection 
          body={description || "The report description will appear here once written."} 
          title="Description" 
          isAi={description.includes("**")} 
        />
        {!description.includes("**") && (
          <>
            <PreviewSection body={affectedPop || "The affected population section will appear here."} title="Affected population" />
            <PreviewSection body={suggestedSol || "The recommended solution will appear here."} title="Recommended solution" />
          </>
        )}
      </div>
    </article>
  );
}

type PreviewSectionProps = {
  title: string;
  body: string;
  isAi?: boolean;
};

function MarkdownContent({ text }: { text: string }) {
  // Regex to remove ** and turn content into bold spans for perfect line consistency
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <span key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
}

function PreviewSection({ title, body, isAi }: PreviewSectionProps) {
  return (
    <section className={isAi ? "rounded-3xl border border-slate-100 bg-slate-50/30 p-6" : ""}>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">{title}</p>
      <div className="text-sm leading-relaxed text-slate-700">
        {isAi ? <MarkdownContent text={body} /> : <p className="whitespace-pre-line leading-relaxed">{body}</p>}
      </div>
    </section>
  );
}

export default StructuredPreview;
