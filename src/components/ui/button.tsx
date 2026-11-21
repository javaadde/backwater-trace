import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ink" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  // Ultramarine: the one action colour. The inner rule repeats the lexicon's double-ruled frame.
  primary: "bg-accent text-accent-ink font-semibold border border-accent-press shadow-[inset_0_0_0_2px_var(--accent),inset_0_0_0_3px_var(--accent-ink)] hover:bg-accent-hover hover:shadow-[inset_0_0_0_2px_var(--accent-hover),inset_0_0_0_3px_var(--accent-ink)] active:bg-accent-press active:shadow-[inset_0_0_0_2px_var(--accent-press),inset_0_0_0_3px_var(--accent-ink)]",
  ink: "bg-fg text-panel font-medium hover:bg-z2 active:bg-z3",
  secondary: "bg-panel text-fg border border-fg font-medium shadow-[inset_0_0_0_2px_var(--panel),inset_0_0_0_3px_var(--line-strong)] hover:bg-panel-2 hover:shadow-[inset_0_0_0_2px_var(--panel-2),inset_0_0_0_3px_var(--line-strong)] active:bg-panel-3",
  ghost: "text-fg-muted hover:text-fg hover:bg-panel-2 active:bg-panel-3",
  danger: "bg-danger text-white font-semibold hover:brightness-110 active:brightness-95",
};
const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px] gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

export function buttonClass(variant: Variant = "secondary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-none transition-[background-color,color,filter,box-shadow] duration-150 disabled:opacity-45 disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
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
