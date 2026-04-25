import FieldShell from "../FieldShell";
import { inputClassName, issueTypes, regions } from "../../../lib/reportForm";
import { FormValues, IssueType, StepKey } from "../../../types/report";

type IssueBasicsStepProps = {
  errors: Partial<Record<StepKey, string>>;
  onFieldChange: <Key extends keyof FormValues>(field: Key, value: FormValues[Key]) => void;
  values: FormValues;
};

function IssueBasicsStep({ errors, onFieldChange, values }: IssueBasicsStepProps) {
  return (
    <div className="space-y-6">
      <FieldShell
        error={errors.title}
        helperText="Use a specific issue title that sounds credible in a policy context."
        label="Issue title"
      >
        <input
          className={inputClassName(errors.title)}
          onChange={(event) => onFieldChange("title", event.target.value)}
          placeholder="Example: Rural clinics unable to provide maternal emergency care"
          value={values.title}
        />
      </FieldShell>

      <div className="grid gap-6 md:grid-cols-2">
        <FieldShell error={errors.region} helperText="Choose the main region affected." label="Region">
          <select
            className={inputClassName(errors.region)}
            onChange={(event) => onFieldChange("region", event.target.value)}
            value={values.region}
          >
            <option value="">Select a region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          error={errors.issueType}
          helperText="This keeps the report structured and easy to browse in the public feed."
          label="Issue type"
        >
          <select
            className={inputClassName(errors.issueType)}
            onChange={(event) => onFieldChange("issueType", event.target.value as IssueType)}
            value={values.issueType}
          >
            <option value="">Select an issue type</option>
            {issueTypes.map((issueType) => (
              <option key={issueType} value={issueType}>
                {issueType}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>
    </div>
  );
}

export default IssueBasicsStep;
