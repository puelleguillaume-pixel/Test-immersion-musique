import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md";

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed",
    size === "md" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs",
    variant === "primary" && "bg-cuir text-ivoire hover:bg-cuir-bright hover:shadow-red-glow",
    variant === "outline" &&
      "border border-ivoire/25 text-ivoire hover:border-cuir hover:text-cuir-bright",
    variant === "ghost" && "text-ivoire/70 hover:text-ivoire",
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />;
  },
);
Button.displayName = "Button";

interface LinkButtonProps extends LinkProps {
  variant?: Variant;
  size?: Size;
}

export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return <Link ref={ref} className={buttonClasses(variant, size, className)} {...props} />;
  },
);
LinkButton.displayName = "LinkButton";
