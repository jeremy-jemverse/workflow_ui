import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn("scroll-m-20 text-4xl font-bold tracking-tight", className)}>
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn("scroll-m-20 text-3xl font-semibold tracking-tight", className)}>
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function P({ children, className }: TypographyProps) {
  return (
    <p className={cn("leading-7", className)}>
      {children}
    </p>
  );
}

export function Label({ children, className }: TypographyProps) {
  return (
    <span className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </span>
  );
}