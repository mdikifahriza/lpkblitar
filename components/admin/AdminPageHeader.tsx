"use client";

import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  if (!action) {
    return <h1 className="sr-only">{title}</h1>;
  }

  return (
    <div className={cn("flex justify-end", className)}>
      <h1 className="sr-only">{title}</h1>
      <div className="w-full sm:w-auto sm:shrink-0">{action}</div>
    </div>
  );
}
