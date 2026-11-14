import { useState, useMemo } from "react";
import { Volume2 } from "lucide-react";
import { toast } from "../ui/sonner";
import { AKHAR_LETTERS, type AkharLetter } from "../../data/languageData";
import type { AkharBoardSectionProps } from "./types";

export default function AkharBoardSection({
  initialLetter,
  onLetterSelect,
}: AkharBoardSectionProps) {
  const [activeLetter, setActiveLetter] = useState<AkharLetter>(
    initialLetter || AKHAR_LETTERS[0]
  );
  const [selectedAkharType, setSelectedAkharType] = useState<
    "all" | "vowel" | "consonant"
  >("all");

  const filteredLetters = useMemo(() => {
    if (selectedAkharType === "all") return AKHAR_LETTERS;
    return AKHAR_LETTERS.filter((l) => l.type === selectedAkharType);
  }, [selectedAkharType]);

  const handleSelectLetter = (letter: AkharLetter) => {
    setActiveLetter(letter);
    onLetterSelect?.(letter);
  };

  const handlePlayLetterPronunciation = (letter: AkharLetter) => {
    toast.info(`Phát âm: "${letter.transliteration}" (${letter.ipa})`, {
      description: `Từ minh họa: "${letter.sampleWord}" mang nghĩa "${letter.meaning}"`,
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl">
      <div className="flex flex-col gap-space-lg">
        {/* Section Header & Type Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Văn Tự Cổ Akhar Thrah
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
              Bảng Ký Tự Số Hóa Tương Tác
            </h2>
            <p className="text-sm text-on-surface-variant">
              Bấm vào từng chữ cái để nghe ngữ âm, ký âm quốc tế IPA và từ vựng biểu đạt.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30">
            <button
              type="button"
              onClick={() => setSelectedAkharType("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedAkharType === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              Tất cả ({AKHAR_LETTERS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedAkharType("vowel")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedAkharType === "vowel"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              Nguyên âm (Inâ)
            </button>
            <button
              type="button"
              onClick={() => setSelectedAkharType("consonant")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedAkharType === "consonant"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              Phụ âm (Măt)
            </button>
          </div>
        </div>

        {/* 12-Column Layout: Grid (8 cols) + Detail Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          <div className="lg:col-span-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {filteredLetters.map((letter) => {
              const isSelected = activeLetter.char === letter.char;
              return (
                <button
                  key={letter.char}
                  onClick={() => handleSelectLetter(letter)}
                  type="button"
                  className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-on-primary border-primary shadow-lg ring-2 ring-primary/20 scale-105"
                      : "bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30 shadow-sm"
                  }`}
                >
                  <span className="font-serif text-3xl font-normal leading-none">
                    {letter.char}
                  </span>
                  <span
                    className={`text-[10px] font-mono mt-1 ${
                      isSelected
                        ? "text-on-primary/80"
                        : "text-on-surface-variant"
                    }`}
                  >
                    {letter.transliteration}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Letter Detail Card */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-md flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="uppercase tracking-widest font-label-sm font-bold text-secondary">
                  {activeLetter.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-mono">
                  {activeLetter.type === "vowel" ? "Nguyên âm" : "Phụ âm"}
                </span>
              </div>

              <div className="w-full py-8 bg-surface-container-low/60 rounded-2xl flex items-center justify-center border border-dashed border-outline-variant/40">
                <span className="font-serif text-7xl text-primary font-normal">
                  {activeLetter.char}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left pt-2">
                <div className="p-3 rounded-xl bg-surface-container flex flex-col">
                  <span className="text-[11px] text-on-surface-variant uppercase font-label-sm">
                    Phiên âm Latinh
                  </span>
                  <strong className="text-base text-on-surface mt-0.5 font-mono">
                    {activeLetter.transliteration}
                  </strong>
                </div>

                <div className="p-3 rounded-xl bg-surface-container flex flex-col">
                  <span className="text-[11px] text-on-surface-variant uppercase font-label-sm">
                    Ký âm IPA
                  </span>
                  <strong className="text-base text-primary mt-0.5 font-mono">
                    {activeLetter.ipa}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Ví dụ minh họa:
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-serif text-lg font-bold text-on-surface">
                    {activeLetter.sampleWord}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    → {activeLetter.meaning}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePlayLetterPronunciation(activeLetter)}
              type="button"
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Volume2 className="h-4 w-4" />
              <span>Nghe phát âm chuẩn</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
