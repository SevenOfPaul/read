import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonType = "default" | "primary" | "info" | "danger" | "warning";
export type ButtonSize = "large" | "normal" | "small" | "mini";

interface VantButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: ButtonType;
  size?: ButtonSize;
  block?: boolean;
  round?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  nativeType?: "submit" | "reset" | "button";
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  large: "py-3 px-6 text-base",
  normal: "py-2 px-4 text-sm",
  small: "py-1.5 px-3 text-sm",
  mini: "py-1 px-2 text-xs",
};

const typeClasses: Record<ButtonType, string> = {
  default: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600",
  primary: "bg-blue-500 hover:bg-blue-600 text-white border border-blue-500",
  info: "bg-blue-300 hover:bg-blue-400 text-white border border-blue-300",
  warning: "bg-orange-500 hover:bg-orange-600 text-white border border-orange-500",
  danger: "bg-red-500 hover:bg-red-600 text-white border border-red-500",
};

export const VantButton = React.forwardRef<HTMLButtonElement, VantButtonProps>(
  (
    {
      type = "default",
      size = "normal",
      block = false,
      round = false,
      disabled = false,
      loading = false,
      loadingText,
      nativeType = "button",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={nativeType}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "whitespace-nowrap",
          sizeClasses[size],
          typeClasses[type],
          round ? "rounded-full" : "rounded-lg",
          block ? "w-full" : "",
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn("animate-spin", size === "mini" ? "h-3 w-3" : "h-4 w-4")} />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

VantButton.displayName = "VantButton";

export default VantButton;
