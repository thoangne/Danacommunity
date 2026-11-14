import { Quote } from "lucide-react";
import type { ProverbCardProps } from "./types";

export default function ProverbCard({
  proverb,
  className = "",
}: ProverbCardProps) {
  return (
    <div
      className={`p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden ${className}`}
    >
      <Quote className="h-12 w-12 text-primary/10 absolute top-4 right-4 pointer-events-none" />

      <div className="flex flex-col gap-2">
        <span className="font-serif text-xl text-primary leading-relaxed">
          {proverb.cham}
        </span>
        <span className="font-mono text-xs text-secondary font-semibold italic">
          {proverb.transliteration}
        </span>
        <h4 className="font-title-md text-base font-bold text-on-surface mt-2 leading-snug">
          &quot;{proverb.vietnamese}&quot;
        </h4>
      </div>

      <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
        <strong className="text-primary font-semibold block mb-0.5">
          Triết lý sống:
        </strong>
        {proverb.philosophy}
      </div>
    </div>
  );
}
