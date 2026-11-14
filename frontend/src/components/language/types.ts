import type { AkharLetter, ChamWord, ChamProverb } from "../../data/languageData";

export type AkharFilterType = "all" | "vowel" | "consonant";

export interface WordCategoryTab {
  id: string;
  label: string;
}

export const DEFAULT_WORD_CATEGORIES: WordCategoryTab[] = [
  { id: "all", label: "Tất cả từ ngữ" },
  { id: "greeting", label: "Chào hỏi & Giao tiếp" },
  { id: "number", label: "Số đếm cổ" },
  { id: "family", label: "Gia đình Mẫu hệ" },
  { id: "culture", label: "Văn hóa & Đền tháp" },
  { id: "craft", label: "Làng nghề gốm - dệt" },
];

export interface AkharLetterCardProps {
  letter: AkharLetter;
  isSelected?: boolean;
  onClick?: (letter: AkharLetter) => void;
  className?: string;
}

export interface AkharLetterInspectorProps {
  letter: AkharLetter;
  onPlayPronunciation?: (letter: AkharLetter) => void;
  className?: string;
}

export interface AkharBoardSectionProps {
  letters?: AkharLetter[];
  initialSelectedLetter?: AkharLetter;
  selectedLetter?: AkharLetter;
  onSelectLetter?: (letter: AkharLetter) => void;
  onPlayPronunciation?: (letter: AkharLetter) => void;
  className?: string;
}

export interface DictionaryWordCardProps {
  word: ChamWord;
  className?: string;
}

export interface ChamDictionarySectionProps {
  words?: ChamWord[];
  categories?: WordCategoryTab[];
  className?: string;
}

export interface ProverbCardProps {
  proverb: ChamProverb;
  className?: string;
}

export interface ChamProverbsSectionProps {
  proverbs?: ChamProverb[];
  className?: string;
}

export interface LanguageHeroSectionProps {
  breadcrumbCurrent?: string;
  tagline?: string;
  title?: string;
  description?: string;
  badgeText?: string;
  className?: string;
}

export interface LanguageCommunityBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}
