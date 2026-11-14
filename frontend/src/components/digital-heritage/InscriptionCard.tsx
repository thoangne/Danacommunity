import type { InscriptionCardProps } from "./types";

export default function InscriptionCard({ inscription }: InscriptionCardProps) {
  return (
    <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col md:flex-row gap-4 p-5 hover:shadow-md transition-shadow">
      <div className="md:w-2/5 aspect-square bg-surface-container rounded-2xl overflow-hidden shrink-0">
        <img
          src={inscription.image}
          alt={inscription.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between gap-3 flex-1">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-primary font-bold">{inscription.code}</span>
            <span className="text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
              {inscription.language}
            </span>
          </div>
          <h4 className="font-serif text-lg font-bold text-on-surface">
            {inscription.title}
          </h4>
          <p className="font-mono text-xs text-secondary italic bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
            "{inscription.transliterationSnippet}"
          </p>
        </div>

        <div className="border-t border-surface-container-high/60 pt-2">
          <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold block mb-1">
            Bản dịch tiếng Việt:
          </span>
          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            {inscription.vietnameseMeaning}
          </p>
        </div>
      </div>
    </div>
  );
}
