import FieldShell from "../FieldShell";
import { inputClassName } from "../../../lib/reportForm";
import { FormValues, StepKey } from "../../../types/report";

type DescriptionStepProps = {
  errors: Partial<Record<StepKey, string>>;
  onFieldChange: <Key extends keyof FormValues>(field: Key, value: FormValues[Key]) => void;
  values: FormValues;
  wordCount: number;
};

function DescriptionStep({ errors, onFieldChange, values, wordCount }: DescriptionStepProps) {
  return (
    <FieldShell
      error={errors.description}
      helperText={`Aim for about 200 words. Current count: ${wordCount} words.`}
      label="What is happening?"
    >
      <textarea
        className={`${inputClassName(errors.description)} min-h-56 resize-none`}
        onChange={(event) => onFieldChange("description", event.target.value)}
        placeholder="Describe the health challenge, why it is urgent, what services are missing, and any context that decision-makers need."
        value={values.description}
      />
    </FieldShell>
  );
}

export default DescriptionStep;
