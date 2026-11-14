import { useState, useMemo } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { CHAM_WORDS } from "../../data/languageData";
import DictionaryWordCard from "./DictionaryWordCard";
import {
  DEFAULT_WORD_CATEGORIES,
  type ChamDictionarySectionProps,
} from "./types";

export default function ChamDictionarySection({
  words = CHAM_WORDS,
  categories = DEFAULT_WORD_CATEGORIES,
  className = "",
}: ChamDictionarySectionProps) {
  const [searchWordQuery, setSearchWordQuery] = useState<string>("");
  const [selectedWordCategory, setSelectedWordCategory] =
    useState<string>("all");

  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const matchCat =
        selectedWordCategory === "all" || w.category === selectedWordCategory;
      const matchSearch =
        searchWordQuery.trim() === "" ||
        w.vietnamese.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
        w.transliteration.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
        w.cham.includes(searchWordQuery);
      return matchCat && matchSearch;
    });
  }, [words, selectedWordCategory, searchWordQuery]);

  return (
    <section
      className={`w-full bg-surface-container-low/50 py-space-xl border-y border-surface-container-high/60 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin flex flex-col gap-space-lg">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Sổ Tay Đàm Thoại
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
              Từ Điển Căn Bản Chăm - Việt
            </h2>
            <p className="text-sm text-on-surface-variant">
              Tra cứu các từ ngữ thông dụng trong giao tiếp, số đếm và thuật ngữ văn hóa đền tháp.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              placeholder="Tra nghĩa tiếng Việt hoặc Chăm..."
              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline text-sm pl-10 pr-9 py-2.5 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
            />
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            {searchWordQuery && (
              <button
                type="button"
                onClick={() => setSearchWordQuery("")}
                aria-label="Xóa từ khóa tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedWordCategory(tab.id)}
              type="button"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedWordCategory === tab.id
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Word Cards Grid or Empty State */}
        {filteredWords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <DictionaryWordCard key={word.id} word={word} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/40 flex flex-col items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-outline/60" />
            <p className="font-serif text-base text-on-surface font-medium">
              Không tìm thấy từ ngữ phù hợp
            </p>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Không có mục từ vựng nào khớp với &quot;{searchWordQuery}&quot;. Vui lòng thử tìm từ khác hoặc chuyển về &quot;Tất cả từ ngữ&quot;.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
