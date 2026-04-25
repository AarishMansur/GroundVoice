import { useEffect, useState } from "react";

import PublicFeed from "./components/feed/PublicFeed";
import LandingPage from "./components/landing/LandingPage";
import ReportDetailView from "./components/report-detail/ReportDetailView";
import ReportBuilder from "./components/report-builder/ReportBuilder";
import SubmissionSuccess from "./components/report-builder/SubmissionSuccess";
import { Submission } from "./types/report";

type AppRoute =
  | { view: "home" }
  | { view: "submit" }
  | { view: "feed" }
  | { view: "report"; submissionId: string };

function getRouteFromHash(hash: string): AppRoute {
  const normalizedHash = hash.replace(/^#/, "").trim();

  if (!normalizedHash || normalizedHash === "/") {
    return { view: "home" };
  }

  if (normalizedHash === "submit") {
    return { view: "submit" };
  }

  if (normalizedHash === "feed") {
    return { view: "feed" };
  }

  if (normalizedHash.startsWith("report/")) {
    const submissionId = normalizedHash.slice("report/".length).trim();
    if (submissionId) {
      return { view: "report", submissionId };
    }
  }

  return { view: "home" };
}


function getPageTitle(route: AppRoute, submittedReport: Submission | null) {
  if (route.view === "report") {
    return "Ground Voice | Report Detail";
  }

  if (route.view === "submit" && submittedReport) {
    return "Ground Voice | Submission Complete";
  }

  if (route.view === "submit") {
    return "Ground Voice | Submit Report";
  }

  if (route.view === "feed") {
    return "Ground Voice | Public Feed";
  }

  return "Ground Voice | NGO Health Reporting";
}

function App() {
  const [submittedReport, setSubmittedReport] = useState<Submission | null>(null);
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash(window.location.hash));

  useEffect(() => {
    function syncRouteFromHash() {
      setRoute(getRouteFromHash(window.location.hash));
    }

    window.addEventListener("hashchange", syncRouteFromHash);
    return () => window.removeEventListener("hashchange", syncRouteFromHash);
  }, []);

  useEffect(() => {
    document.title = getPageTitle(route, submittedReport);
  }, [route, submittedReport]);

  function navigate(nextRoute: AppRoute) {
    if (nextRoute.view === "home") {
      window.location.hash = "/";
      return;
    }

    if (nextRoute.view === "submit") {
      window.location.hash = "submit";
      return;
    }

    if (nextRoute.view === "feed") {
      window.location.hash = "feed";
      return;
    }

    window.location.hash = `report/${nextRoute.submissionId}`;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(155,196,224,0.28),_transparent_40%),linear-gradient(180deg,_#f7fbff_0%,_#eef5fb_45%,_#f7f4ee_100%)] text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex flex-col items-center gap-6 border-b border-white/60 pb-8 text-center">
          {route.view !== "home" && (
            <div className="flex flex-col items-center gap-4">
              <div className="max-w-4xl">
                <span className="inline-block rounded-full bg-sky-100 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.4em] text-sky-800 shadow-sm ring-1 ring-sky-200">
                  Ground Voice Platform
                </span>
                <h1 className="mt-4 font-['Space_Grotesk',_'Segoe_UI',_sans-serif] text-4xl font-bold leading-tight tracking-[-0.05em] text-slate-950 sm:text-5xl">
                  {route.view === "submit" ? "Submit a new report" : "Public Health Feed"}
                </h1>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              className={`rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 ${
                route.view === "home"
                  ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20 translate-y-[-1px]"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => navigate({ view: "home" })}
              type="button"
            >
              Home
            </button>
            <button
              className={`rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 ${
                route.view === "submit"
                  ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20 translate-y-[-1px]"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => {
                setSubmittedReport(null);
                navigate({ view: "submit" });
              }}
              type="button"
            >
              Submit a report
            </button>
            <button
              className={`rounded-full px-8 py-3 text-sm font-bold transition-all duration-300 ${
                route.view === "feed"
                  ? "bg-slate-950 text-white shadow-xl shadow-slate-950/20 translate-y-[-1px]"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
              onClick={() => navigate({ view: "feed" })}
              type="button"
            >
              View public feed
            </button>
          </div>
        </header>

        {route.view === "home" ? (
          <LandingPage
            onSubmitReport={() => {
              setSubmittedReport(null);
              navigate({ view: "submit" });
            }}
            onViewFeed={() => navigate({ view: "feed" })}
          />
        ) : route.view === "feed" ? (
          <PublicFeed
            onCreateReport={() => {
              setSubmittedReport(null);
              navigate({ view: "submit" });
            }}
            onViewReport={(submissionId) => navigate({ view: "report", submissionId })}
          />
        ) : route.view === "report" ? (
          <ReportDetailView
            onCreateReport={() => {
              setSubmittedReport(null);
              navigate({ view: "submit" });
            }}
            onViewFeed={() => navigate({ view: "feed" })}
            submissionId={route.submissionId}
          />
        ) : submittedReport ? (
          <SubmissionSuccess
            onReset={() => {
              setSubmittedReport(null);
              navigate({ view: "submit" });
            }}
            onViewFeed={() => navigate({ view: "feed" })}
            onViewReport={() => navigate({ view: "report", submissionId: submittedReport.id })}
            submission={submittedReport}
          />
        ) : (
          <ReportBuilder
            onSubmitted={(submission) => {
              setSubmittedReport(submission);
              navigate({ view: "submit" });
            }}
          />
        )}
      </section>
    </main>
  );
}

export default App;
