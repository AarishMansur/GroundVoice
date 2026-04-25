import { SubmitEvent, useMemo, useState } from "react";

import { API_BASE_URL, initialValues, steps, validateField } from "../../lib/reportForm";
import { FormValues, StepKey, Submission, SubmissionResponse } from "../../types/report";
import StepSidebar from "./StepSidebar";
import StructuredPreview from "./StructuredPreview";
import AffectedPopulationStep from "./steps/AffectedPopulationStep";
import DescriptionStep from "./steps/DescriptionStep";
import IssueBasicsStep from "./steps/IssueBasicsStep";
import RecommendationStep from "./steps/RecommendationStep";
import LoadingSpinner from "../shared/LoadingSpinner";

type ReportBuilderProps = {
  onSubmitted: (submission: Submission) => void;
};

function ReportBuilder({ onSubmitted }: ReportBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<StepKey, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const wordCount = useMemo(
    () => formValues.description.trim().split(/\s+/).filter(Boolean).length,
    [formValues.description],
  );

  function updateField<Key extends keyof FormValues>(field: Key, value: FormValues[Key]) {
    setFormValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }
      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function validateStep(stepNumber: number) {
    const step = steps.find((entry) => entry.id === stepNumber);
    if (!step) {
      return true;
    }

    const nextErrors: Partial<Record<StepKey, string>> = {};
    for (const field of step.fields) {
      const message = validateField(field, formValues);
      if (message) {
        nextErrors[field] = message;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors((current) => ({ ...current, ...nextErrors }));
      return false;
    }

    return true;
  }

  function goToNextStep() {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, steps.length + 1));
  }

  async function handleAiAnalysis() {
    setIsAnalyzing(true);
    setSubmissionError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: formValues.description }),
      });

      if (!response.ok) throw new Error("AI analysis failed.");
      const data = await response.json();
      setAiReport(data.aiReport);
    } catch (error) {
      setSubmissionError("AI could not analyze the report. You can still submit your manual version.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      const submissionData = aiReport 
        ? { ...formValues, description: aiReport }
        : formValues;

      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("The server returned HTML instead of JSON. Check the API route and dev server.");
      }

      const payload = (await response.json()) as SubmissionResponse | { message?: string };
      const errorMessage = "message" in payload ? payload.message : undefined;

      if (!response.ok || !("submission" in payload)) {
        throw new Error(errorMessage ?? "We could not save the report right now.");
      }

      onSubmitted(payload.submission);
      setFormValues(initialValues);
      setAiReport(null);
      setErrors({});
      setCurrentStep(1);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Something went wrong while submitting the report.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return <IssueBasicsStep errors={errors} onFieldChange={updateField} values={formValues} />;
      case 2:
        return <DescriptionStep errors={errors} onFieldChange={updateField} values={formValues} wordCount={wordCount} />;
      case 3:
        return <AffectedPopulationStep errors={errors} onFieldChange={updateField} values={formValues} />;
      case 4:
        return <RecommendationStep errors={errors} onFieldChange={updateField} values={formValues} />;
      case 5:
        return (
          <StructuredPreview
            affectedPop={formValues.affectedPop}
            authorName={formValues.authorName}
            description={aiReport || formValues.description}
            issueType={formValues.issueType || "Pending classification"}
            region={formValues.region}
            suggestedSol={formValues.suggestedSol}
            title={formValues.title}
          />
        );
      default:
        return null;
    }
  }

  return (
    <section className="grid flex-1 gap-8 py-10 lg:grid-cols-[0.78fr_1.22fr]">
      <StepSidebar currentStep={currentStep} />

      <form
        className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8"
        onSubmit={handleSubmit}
      >
        {submissionError ? <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{submissionError}</div> : null}

        {renderStepContent()}

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentStep === 1 || isSubmitting}
            onClick={() => setCurrentStep((step) => Math.max(step - 1, 1))}
            type="button"
          >
            Back
          </button>

          <div className="flex flex-1 items-center justify-end gap-3">
            {currentStep < 5 ? (
              <button
                className="rounded-full bg-sky-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 hover:bg-sky-800"
                onClick={goToNextStep}
                type="button"
              >
                Continue
              </button>
            ) : (
              <div className="flex items-center gap-3">
                {!aiReport && (
                  <button
                    className="rounded-full border border-sky-200 bg-sky-50 px-8 py-3.5 text-sm font-bold text-sky-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-sky-100 disabled:opacity-50"
                    disabled={isAnalyzing || isSubmitting}
                    onClick={handleAiAnalysis}
                    type="button"
                  >
                    {isAnalyzing ? (
                      <LoadingSpinner label="AI Analyzing..." size="sm" tone="dark" />
                    ) : (
                      "✨ Enhance with AI"
                    )}
                  </button>
                )}
                <button
                  className="rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting || isAnalyzing}
                  type="submit"
                >
                  {isSubmitting ? (
                    <LoadingSpinner label="Submitting..." size="sm" tone="light" />
                  ) : (
                    aiReport ? "Submit AI Version" : "Submit Original"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

export default ReportBuilder;
