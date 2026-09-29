import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle" | "amber";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 shadow-xs",
      secondary:
        "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 shadow-xs",
      outline:
        "border border-slate-200 bg-white text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 hover:border-blue-200",
      ghost:
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      destructive:
        "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
      subtle:
        "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100",
      amber:
        "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-9 px-3.5 text-xs sm:text-sm gap-2",
      lg: "h-11 px-5 text-sm gap-2",
      icon: "h-8 w-8 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
