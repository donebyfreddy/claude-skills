import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  children,
  id,
  className = "",
}: {
  eyebrow: string;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-accent" />
        {eyebrow}
      </p>
      <h2 id={id} className="display text-[clamp(2.6rem,6.2vw,5.2rem)]">
        {children}
      </h2>
    </div>
  );
}
