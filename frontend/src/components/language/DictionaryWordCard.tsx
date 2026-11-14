import type { DictionaryWordCardProps } from "./types";

export default function DictionaryWordCard({
  word,
  className = "",
}: DictionaryWordCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-serif text-2xl text-primary font-medium block">
            {word.cham}
          </span>
          <span className="font-mono text-xs text-secondary font-semibold mt-1 block">
            {word.transliteration}
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface-variant uppercase font-mono">
          {word.category}
        </span>
      </div>

      <div className="border-t border-surface-container-high/60 pt-3">
        <span className="font-title-sm text-sm font-bold text-on-surface">
          {word.vietnamese}
        </span>
        {word.exampleSentence && (
          <p className="font-body-sm text-xs text-on-surface-variant italic mt-1 leading-relaxed">
            Ví dụ: &quot;{word.exampleSentence}&quot; → {word.exampleMeaning}
          </p>
        )}
      </div>
    </div>
  );
}
