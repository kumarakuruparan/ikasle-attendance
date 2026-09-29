import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "destructive"
    | "info"
    | "outline"
    | "purple"
    | "amber";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    default:
      "bg-slate-50 text-slate-700 border border-slate-200",
    success:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning:
      "bg-amber-50 text-amber-700 border border-amber-200",
    destructive:
      "bg-red-50 text-red-700 border border-red-200",
    info:
      "bg-blue-50 text-blue-700 border border-blue-200",
    purple:
      "bg-blue-50/80 text-blue-800 border border-blue-200",
    amber:
      "bg-amber-50 text-amber-700 border border-amber-200",
    outline:
      "border border-slate-200 text-slate-600 bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium tracking-normal",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
