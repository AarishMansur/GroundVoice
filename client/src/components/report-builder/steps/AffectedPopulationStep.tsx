import FieldShell from "../FieldShell";
import { inputClassName } from "../../../lib/reportForm";
import { FormValues, StepKey } from "../../../types/report";

type AffectedPopulationStepProps = {
  errors: Partial<Record<StepKey, string>>;
  onFieldChange: <Key extends keyof FormValues>(field: Key, value: FormValues[Key]) => void;
  values: FormValues;
};

function AffectedPopulationStep({ errors, onFieldChange, values }: AffectedPopulationStepProps) {
  return (
    <FieldShell
      error={errors.affectedPop}
      helperText="Explain who is affected, approximate scale, and the human impact."
      label="Affected population"
    >
      <textarea
        className={`${inputClassName(errors.affectedPop)} min-h-56 resize-none`}
        onChange={(event) => onFieldChange("affectedPop", event.target.value)}
        placeholder="Example: Pregnant women in low-income rural communities are traveling long distances to reach understaffed clinics, increasing the risk of complications."
        value={values.affectedPop}
      />
    </FieldShell>
  );
}

export default AffectedPopulationStep;
