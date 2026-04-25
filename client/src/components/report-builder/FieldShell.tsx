import { ReactNode } from "react";

type FieldShellProps = {
  children: ReactNode;
  error?: string;
  helperText: string;
  label: string;
};

function FieldShell({ children, error, helperText, label }: FieldShellProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-900">{label}</span>
        {error ? <span className="text-sm font-medium text-rose-600">{error}</span> : null}
      </div>
      <div className="mt-2">{children}</div>
      <p className="mt-2 text-sm leading-6 text-slate-500">{error ?? helperText}</p>
    </label>
  );
}

export default FieldShell;
