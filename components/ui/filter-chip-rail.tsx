"use client";

import { cn } from "@/lib/utils";

export type FilterChipOption = {
  value: string;
  label: string;
  mobileLabel?: string;
};

type FilterChipRailProps = {
  options: FilterChipOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
  desktopClassName?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
  inactiveButtonClassName?: string;
};

export function FilterChipRail({
  options,
  activeValue,
  onChange,
  className,
  desktopClassName,
  buttonClassName,
  activeButtonClassName,
  inactiveButtonClassName,
}: FilterChipRailProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex gap-2 overflow-x-auto pb-1 pr-4 no-scrollbar snap-x snap-proximity md:flex-wrap md:overflow-visible md:pb-0 md:pr-0 md:snap-none",
          desktopClassName
        )}
      >
        {options.map((option) => {
          const isActive = activeValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={isActive}
              className={cn(
                "min-h-8 shrink-0 snap-start rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 md:min-h-10",
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                activeButtonClassName && isActive ? activeButtonClassName : null,
                inactiveButtonClassName && !isActive ? inactiveButtonClassName : null,
                buttonClassName
              )}
            >
              <span className="md:hidden">{option.mobileLabel ?? option.label}</span>
              <span className="hidden md:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
