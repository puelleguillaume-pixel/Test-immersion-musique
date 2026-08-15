import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  kicker?: string;
  title?: ReactNode;
  description?: string;
}

export function Section({ children, className, id, kicker, title, description }: SectionProps) {
  return (
    <section id={id} className={cn("relative px-6 py-24 sm:px-10 lg:px-16", className)}>
      {(kicker || title) && (
        <header className="mb-12 max-w-2xl">
          {kicker && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-cuir-bright">
              {kicker}
            </p>
          )}
          {title && (
            <h2 className="font-display text-3xl font-semibold leading-tight text-ivoire sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          )}
          {description && <p className="mt-4 text-brume-pale/80">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
