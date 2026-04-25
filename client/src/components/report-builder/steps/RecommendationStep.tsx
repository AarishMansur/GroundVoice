import FieldShell from "../FieldShell";
import { inputClassName } from "../../../lib/reportForm";
import { FormValues, StepKey } from "../../../types/report";

type RecommendationStepProps = {
  errors: Partial<Record<StepKey, string>>;
  onFieldChange: <Key extends keyof FormValues>(field: Key, value: FormValues[Key]) => void;
  values: FormValues;
};

function RecommendationStep({ errors, onFieldChange, values }: RecommendationStepProps) {
  return (
    <div className="space-y-6">
      <FieldShell
        error={errors.suggestedSol}
        helperText="Keep the recommendation specific, realistic, and policy-friendly."
        label="Suggested solution"
      >
        <textarea
          className={`${inputClassName(errors.suggestedSol)} min-h-56 resize-none`}
          onChange={(event) => onFieldChange("suggestedSol", event.target.value)}
          placeholder="Example: Fund mobile maternal care units, expand rural midwife training, and prioritize emergency referral transport in district budgets."
          value={values.suggestedSol}
        />
      </FieldShell>

      <FieldShell
        error={errors.authorName}
        helperText="Use the NGO or report author name that should appear on the statement."
        label="Reporting organization"
      >
        <input
          className={inputClassName(errors.authorName)}
          onChange={(event) => onFieldChange("authorName", event.target.value)}
          placeholder="Example: GNEC Community Health Network"
          value={values.authorName}
        />
      </FieldShell>
    </div>
  );
}

export default RecommendationStep;
