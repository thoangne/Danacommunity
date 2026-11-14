import type { AkharLetterCardProps } from "./types";

export default function AkharLetterCard({
  letter,
  isSelected = false,
  onClick,
  className = "",
}: AkharLetterCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(letter)}
      aria-label={`Ký tự ${letter.name}: ${letter.char} (${letter.transliteration})`}
      aria-pressed={isSelected}
      className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer border ${
        isSelected
          ? "bg-primary text-on-primary border-primary shadow-lg ring-2 ring-primary/20 scale-105"
          : "bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30 hover:border-primary/40 shadow-sm"
      } ${className}`}
    >
      <span className="font-serif text-3xl font-normal leading-none select-none">
        {letter.char}
      </span>
      <span
        className={`text-[10px] font-mono mt-1 select-none ${
          isSelected ? "text-on-primary/80" : "text-on-surface-variant"
        }`}
      >
        {letter.transliteration}
      </span>
    </button>
  );
}
