import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
    variant?: "toolbar" | "card";
  }
>(({ className, variant = "toolbar", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-1",
      variant === "toolbar" && "rounded-lg bg-muted p-1",
      variant === "card" && "mb-4",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "toolbar" | "card";
    size?: "md" | "lg";
  }
>(({ className, variant = "toolbar", size = "md", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Toolbar variant
      variant === "toolbar" && [
        "rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background",
        "text-muted-foreground hover:text-foreground",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
      ],
      // Card variant
      variant === "card" && [
        "rounded-md px-3 py-1.5 text-sm font-medium",
        "text-muted-foreground hover:text-foreground",
        "data-[state=active]:text-teal-500 data-[state=active]:border-b-2 data-[state=active]:border-teal-500"
      ],
      // Sizes
      size === "md" && "text-sm",
      size === "lg" && "text-base px-4 py-2",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };