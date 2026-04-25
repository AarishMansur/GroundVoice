import { steps } from "../../lib/reportForm";

type StepSidebarProps = {
  currentStep: number;
};

function StepSidebar({ currentStep }: StepSidebarProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <aside className="self-start rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            Step {currentStep} of {steps.length}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{steps[currentStep - 1].title}</p>
        </div>
        <div className="rounded-full bg-sky-50 px-4 py-2 text-sm font-medium text-sky-900">
          {Math.round(progress)}%
        </div>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-sky-700 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-8 space-y-3">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <li
              key={step.id}
              className={`rounded-2xl border px-4 py-4 transition ${isActive
                ? "border-sky-300 bg-sky-50"
                : isComplete
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white"
                }`}
            >
              <div className="flex gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${isActive
                    ? "bg-sky-900 text-white"
                    : isComplete
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                    }`}
                >
                  {step.id}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.caption}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

export default StepSidebar;
