import { Volume2 } from "lucide-react";
import { toast } from "../ui/sonner";
import type { AkharLetterInspectorProps } from "./types";

export default function AkharLetterInspector({
  letter,
  onPlayPronunciation,
  className = "",
}: AkharLetterInspectorProps) {
  const handlePlayPronunciation = () => {
    if (onPlayPronunciation) {
      onPlayPronunciation(letter);
    } else {
      toast.info(`Phát âm: "${letter.transliteration}" (${letter.ipa})`, {
        description: `Từ minh họa: "${letter.sampleWord}" mang nghĩa "${letter.meaning}"`,
      });
    }
  };

  const typeLabel =
    letter.type === "vowel"
      ? "Nguyên âm"
      : letter.type === "consonant"
      ? "Phụ âm"
      : "Ký hiệu âm";

  return (
    <div
      className={`bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-md flex flex-col justify-between gap-4 ${className}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span className="uppercase tracking-widest font-label-sm font-bold text-secondary">
            {letter.name}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-mono">
            {typeLabel}
          </span>
        </div>

        {/* Large Letter Display */}
        <div className="w-full py-8 bg-surface-container-low/60 rounded-2xl flex items-center justify-center border border-dashed border-outline-variant/40">
          <span className="font-serif text-7xl text-primary font-normal select-none">
            {letter.char}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-left pt-2">
          <div className="p-3 rounded-xl bg-surface-container flex flex-col">
            <span className="text-[11px] text-on-surface-variant uppercase font-label-sm">
              Phiên âm Latinh
            </span>
            <strong className="text-base text-on-surface mt-0.5 font-mono">
              {letter.transliteration}
            </strong>
          </div>

          <div className="p-3 rounded-xl bg-surface-container flex flex-col">
            <span className="text-[11px] text-on-surface-variant uppercase font-label-sm">
              Ký âm IPA
            </span>
            <strong className="text-base text-primary mt-0.5 font-mono">
              {letter.ipa}
            </strong>
          </div>
        </div>

        {/* Sample word */}
        <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Ví dụ minh họa thực tiễn:
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="font-serif text-lg font-bold text-on-surface">
              {letter.sampleWord}
            </span>
            <span className="text-xs text-on-surface-variant">
              → {letter.meaning}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePlayPronunciation}
        type="button"
        className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
      >
        <Volume2 className="h-4 w-4" />
        <span>Nghe ngữ âm & phát âm chuẩn</span>
      </button>
    </div>
  );
}
