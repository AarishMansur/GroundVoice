import React from "react";

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
  const isAiContent = description.includes("**");

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
        {isAiContent ? (
          <AiReportSection content={description} />
        ) : (
          <>
            <PreviewSection body={description || "The report description will appear here once written."} title="Description" />
            <PreviewSection body={affectedPop || "The affected population section will appear here."} title="Affected population" />
            <PreviewSection body={suggestedSol || "The recommended solution will appear here."} title="Recommended solution" />
          </>
        )}
      </div>
    </article>
  );
}

function AiReportSection({ content }: { content: string }) {
  return (
    <section className="rounded-3xl border border-sky-100 bg-gradient-to-br from-slate-50 to-sky-50/30 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-sky-100 bg-gradient-to-r from-sky-600 to-emerald-600 px-6 py-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          AI-Generated SITREP
        </span>
      </div>
      <div className="p-6">
        <MarkdownRenderer text={content} />
      </div>
    </section>
  );
}

function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listItems.length === 0) return;
    const tag = listType === "ol" ? "ol" : "ul";
    const listClass = listType === "ol"
      ? "list-decimal pl-5 space-y-1.5 text-sm leading-relaxed text-slate-700"
      : "list-disc pl-5 space-y-1.5 text-sm leading-relaxed text-slate-700";

    elements.push(
      tag === "ol" ? (
        <ol key={`list-${elements.length}`} className={listClass}>
          {listItems.map((item, i) => (
            <li key={i}><InlineMarkdown text={item} /></li>
          ))}
        </ol>
      ) : (
        <ul key={`list-${elements.length}`} className={listClass}>
          {listItems.map((item, i) => (
            <li key={i}><InlineMarkdown text={item} /></li>
          ))}
        </ul>
      )
    );
    listItems = [];
    listType = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="my-4 border-slate-200" />);
      continue;
    }

    const h1Match = trimmed.match(/^#\s+(.+)/);
    if (h1Match) {
      flushList();
      elements.push(
        <h3 key={`h1-${i}`} className="mt-5 mb-2 text-lg font-bold tracking-tight text-slate-950">
          <InlineMarkdown text={h1Match[1]} />
        </h3>
      );
      continue;
    }

    const h2Match = trimmed.match(/^##\s+(.+)/);
    if (h2Match) {
      flushList();
      elements.push(
        <h4 key={`h2-${i}`} className="mt-4 mb-2 text-base font-bold tracking-tight text-slate-900">
          <InlineMarkdown text={h2Match[1]} />
        </h4>
      );
      continue;
    }

    const h3Match = trimmed.match(/^###\s+(.+)/);
    if (h3Match) {
      flushList();
      elements.push(
        <h5 key={`h3-${i}`} className="mt-3 mb-1.5 text-sm font-bold uppercase tracking-wider text-slate-700">
          <InlineMarkdown text={h3Match[1]} />
        </h5>
      );
      continue;
    }

    const boldHeadingMatch = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (boldHeadingMatch && !trimmed.includes(". ")) {
      flushList();
      elements.push(
        <h4 key={`bh-${i}`} className="mt-4 mb-2 text-base font-bold tracking-tight text-slate-900">
          {boldHeadingMatch[1]}
        </h4>
      );
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      if (listType === "ol") flushList();
      listType = "ul";
      listItems.push(ulMatch[1]);
      continue;
    }

    const olMatch = trimmed.match(/^\d+[.)]\s+(.+)/);
    if (olMatch) {
      if (listType === "ul") flushList();
      listType = "ol";
      listItems.push(olMatch[1]);
      continue;
    }

    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-sm leading-relaxed text-slate-700">
        <InlineMarkdown text={trimmed} />
      </p>
    );
  }

  flushList();

  return <div className="space-y-2">{elements}</div>;
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <span key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

type PreviewSectionProps = {
  title: string;
  body: string;
};

function PreviewSection({ title, body }: PreviewSectionProps) {
  return (
    <section>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4">{title}</p>
      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{body}</p>
    </section>
  );
}

export default StructuredPreview;

