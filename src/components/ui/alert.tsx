import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { X } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        info: "border-blue-500/50 text-blue-500 [&>svg]:text-blue-500 bg-blue-500/10",
        error: "border-destructive/50 text-destructive [&>svg]:text-destructive bg-destructive/10",
        warning: "border-yellow-500/50 text-yellow-500 [&>svg]:text-yellow-500 bg-yellow-500/10",
        success: "border-emerald-500/50 text-emerald-500 [&>svg]:text-emerald-500 bg-emerald-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      onClose?: () => void;
      primaryAction?: {
        label: string;
        onClick: () => void;
      };
      secondaryAction?: {
        label: string;
        onClick: () => void;
      };
    }
>(
  (
    {
      className,
      variant,
      onClose,
      primaryAction,
      secondaryAction,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">{children}</div>
          <div className="flex items-center gap-2">
            {secondaryAction && (
              <Button
                variant="ghost"
                size="sm"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert, alertVariants };