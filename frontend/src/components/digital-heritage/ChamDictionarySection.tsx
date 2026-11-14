import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CHAM_WORDS } from "../../data/languageData";
import type { ChamDictionarySectionProps } from "./types";

const DICTIONARY_CATEGORIES = [
  { id: "all", label: "Tất cả từ ngữ" },
  { id: "greeting", label: "Chào hỏi & Giao tiếp" },
  { id: "number", label: "Số đếm cổ" },
  { id: "family", label: "Gia đình Mẫu hệ" },
  { id: "culture", label: "Văn hóa & Đền tháp" },
  { id: "craft", label: "Làng nghề gốm - dệt" },
];

export default function ChamDictionarySection({
  initialCategory = "all",
}: ChamDictionarySectionProps) {
  const [searchWordQuery, setSearchWordQuery] = useState<string>("");
  const [selectedWordCategory, setSelectedWordCategory] =
    useState<string>(initialCategory);

  const filteredWords = useMemo(() => {
    return CHAM_WORDS.filter((w) => {
      const matchCat =
        selectedWordCategory === "all" || w.category === selectedWordCategory;
      const matchSearch =
        searchWordQuery.trim() === "" ||
        w.vietnamese.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
        w.transliteration.toLowerCase().includes(searchWordQuery.toLowerCase()) ||
        w.cham.includes(searchWordQuery);
      return matchCat && matchSearch;
    });
  }, [selectedWordCategory, searchWordQuery]);

  return (
    <section className="w-full bg-surface-container-low/50 py-space-xl border-t border-surface-container-high/60">
      <div className="max-w-7xl mx-auto px-margin-mobile xl:px-margin flex flex-col gap-space-lg">
        {/* Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Sổ Tay Đàm Thoại
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-on-surface font-semibold">
              Từ Điển Căn Bản Chăm - Việt
            </h2>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchWordQuery}
              onChange={(e) => setSearchWordQuery(e.target.value)}
              placeholder="Tra nghĩa tiếng Việt hoặc Chăm..."
              aria-label="Tra cứu từ điển Chăm - Việt"
              className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline text-sm pl-10 pr-9 py-2.5 rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
            />
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
            {searchWordQuery && (
              <button
                type="button"
                onClick={() => setSearchWordQuery("")}
                aria-label="Xoá tìm kiếm"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dictionary Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {DICTIONARY_CATEGORIES.map((tab) => (
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

        {/* Words Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col justify-between gap-3"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
