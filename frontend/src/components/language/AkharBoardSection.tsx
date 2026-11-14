import { useState, useMemo } from "react";
import { AKHAR_LETTERS, type AkharLetter } from "../../data/languageData";
import AkharLetterCard from "./AkharLetterCard";
import AkharLetterInspector from "./AkharLetterInspector";
import type { AkharBoardSectionProps, AkharFilterType } from "./types";

export default function AkharBoardSection({
  letters = AKHAR_LETTERS,
  initialSelectedLetter,
  selectedLetter: controlledLetter,
  onSelectLetter,
  onPlayPronunciation,
  className = "",
}: AkharBoardSectionProps) {
  const [internalSelectedLetter, setInternalSelectedLetter] =
    useState<AkharLetter>(initialSelectedLetter || letters[0] || AKHAR_LETTERS[0]);
  const [selectedAkharType, setSelectedAkharType] =
    useState<AkharFilterType>("all");

  const currentActiveLetter = controlledLetter || internalSelectedLetter;

  const handleSelectLetter = (letter: AkharLetter) => {
    if (onSelectLetter) {
      onSelectLetter(letter);
    }
    if (!controlledLetter) {
      setInternalSelectedLetter(letter);
    }
  };

  const filteredLetters = useMemo(() => {
    if (selectedAkharType === "all") return letters;
    return letters.filter((l) => l.type === selectedAkharType);
  }, [letters, selectedAkharType]);

  const vowelCount = useMemo(
    () => letters.filter((l) => l.type === "vowel").length,
    [letters]
  );
  const consonantCount = useMemo(
    () => letters.filter((l) => l.type === "consonant").length,
    [letters]
  );

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-margin-mobile xl:px-margin py-space-xl ${className}`}
    >
      <div className="flex flex-col gap-space-lg">
        {/* Section Header & Type Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Bảng Chữ Cái Tương Tác
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
              Hệ Ký Tự Akhar Thrah
            </h2>
            <p className="text-sm text-on-surface-variant">
              Bấm vào từng chữ cái để nghe ngữ âm, ký âm quốc tế IPA và từ vựng biểu đạt.
            </p>
          </div>

          {/* Type Switcher */}
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/30 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedAkharType("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedAkharType === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              Tất cả ({letters.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedAkharType("vowel")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedAkharType === "vowel"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              Nguyên âm (Inâ){vowelCount > 0 ? ` (${vowelCount})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setSelectedAkharType("consonant")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedAkharType === "consonant"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              Phụ âm (Măt){consonantCount > 0 ? ` (${consonantCount})` : ""}
            </button>
          </div>
        </div>

        {/* Grid & Active Card Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Letters Grid */}
          <div className="lg:col-span-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {filteredLetters.map((letter) => (
              <AkharLetterCard
                key={letter.char}
                letter={letter}
                isSelected={currentActiveLetter.char === letter.char}
                onClick={handleSelectLetter}
              />
            ))}
          </div>

          {/* Active Letter Inspector Card */}
          <div className="lg:col-span-4">
            <AkharLetterInspector
              letter={currentActiveLetter}
              onPlayPronunciation={onPlayPronunciation}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
