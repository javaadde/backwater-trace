import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ink" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // The one glowing accent: the action that moves the work forward.
  primary: "bg-accent text-accent-ink font-semibold hover:bg-accent-hover active:bg-accent-press",
  ink: "bg-fg text-panel font-medium hover:bg-z2 active:bg-z3",
  secondary: "bg-panel text-fg border border-line-strong font-medium hover:bg-panel-2 hover:border-z7 active:bg-panel-3",
  ghost: "text-fg-muted hover:text-fg hover:bg-panel-2 active:bg-panel-3",
  danger: "bg-danger text-white font-semibold hover:brightness-110 active:brightness-95",
};
const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

export function buttonClass(variant: Variant = "secondary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-[background-color,color,filter] duration-150 disabled:opacity-45 disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
