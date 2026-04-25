type LoadingSpinnerProps = {
  label?: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-10 w-10 border-[3px]",
};

const toneClasses = {
  light: "border-white/30 border-t-white",
  dark: "border-slate-300 border-t-sky-700",
};

function LoadingSpinner({
  label = "Loading",
  size = "md",
  tone = "dark",
}: LoadingSpinnerProps) {
  return (
    <span className="inline-flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`${sizeClasses[size]} ${toneClasses[tone]} inline-block animate-spin rounded-full`}
      />
      <span>{label}</span>
    </span>
  );
}

export default LoadingSpinner;
