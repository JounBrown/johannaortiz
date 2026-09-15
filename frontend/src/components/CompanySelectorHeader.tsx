'use client';

type CompanySelectorHeaderProps = {
  compact?: boolean;
  className?: string;
  align?: "start" | "end";
};

export function CompanySelectorHeader({
  compact = false,
  className,
  align = "end",
}: CompanySelectorHeaderProps) {
  return (
    <button
      type="button"
      aria-label="J"
      title="J"
      className={`flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-lg font-bold text-white shadow-sm transition-colors hover:bg-blue-700 ${className ?? ""}`}
    >
      J
    </button>
  );
}
