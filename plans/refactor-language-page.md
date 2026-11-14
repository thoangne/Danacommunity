# Implementation Plan: Refactor LanguagePage Component & Modularization

> **Status**: `COMPLETED`  
> **Author**: Antigravity  
> **Target Date**: 2026-11-14  
> **Risk Level**: `MEDIUM`

---

## 1. Objective
Refactor `frontend/src/pages/LanguagePage.tsx` (446 lines) into a clean, modular, and highly reusable architecture by decomposing its monolithic inline sections and sub-elements into dedicated reusable components in `frontend/src/components/language/`. This significantly improves maintainability, reusability (enabling components like `AkharBoardSection`, `ChamDictionarySection`, `ProverbCard`, etc., to be reused across `DigitalHeritagePage` and other heritage modules), testability, and code readability while strictly preserving 100% of the existing UI styling, interaction behavior, and accessibility.

---

## 2. Scope & Non-Goals

### In Scope
- Create modular component directory `frontend/src/components/language/` with:
  - `types.ts`: Type contracts for filtering, categories, and component props.
  - `AkharLetterCard.tsx`: Reusable single Akhar character button/card with selection states.
  - `AkharLetterInspector.tsx`: Detailed card inspector for selected Akhar character (large display, Latin/IPA, sample word, pronunciation action).
  - `AkharBoardSection.tsx`: Interactive Akhar Thrah alphabet board (type switcher, letter grid, active inspector, sound toast).
  - `DictionaryWordCard.tsx`: Reusable vocabulary card with Cham script, transliteration, Vietnamese translation, category badge, and usage examples.
  - `ChamDictionarySection.tsx`: Mini Cham - Vietnamese conversational dictionary (search query filter, category tabs, grid of word cards, and empty state).
  - `ProverbCard.tsx`: Reusable folk proverb card with watermark quote, Cham text, translation, and philosophical reflection.
  - `ChamProverbsSection.tsx`: Proverbs showcase section with header and responsive grid.
  - `LanguageHeroSection.tsx`: Hero banner with breadcrumb, title lockup, and cultural metadata.
  - `LanguageCommunityBanner.tsx`: Heritage education call-to-action banner for free community language classes.
  - `index.ts`: Centralized barrel export for all language components and types.
- Refactor `LanguagePage.tsx` into a high-level declarative orchestrator (< 60 lines).
- Ensure strict TypeScript compliance and 0 ESLint warnings/errors.

### Non-Goals (Out of Scope)
- Do not modify database schemas, backend APIs, or routes.
- Do not alter visual appearance, Tailwind CSS tokens, or Vietnamese copy text.
- Do not modify unrelated files in `frontend` or `backend`.

---

## 3. Requirements & Acceptance Criteria

- [x] **AC 1 (Modularization & Line Reduction)**: `LanguagePage.tsx` is reduced from 446 lines to 54 lines (< 70 lines), cleanly orchestrating dedicated subcomponents in `frontend/src/components/language/`.
- [x] **AC 2 (Behavior Preservation - Akhar Board)**:
  - Switching between "Tất cả", "Nguyên âm (Inâ)", and "Phụ âm (Măt)" filters the letter grid accurately.
  - Clicking any letter button updates the active letter in the inspector card.
  - Clicking "Nghe ngữ âm & phát âm chuẩn" triggers the exact same `toast.info` with pronunciation and sample word details.
- [x] **AC 3 (Behavior Preservation - Dictionary)**:
  - Searching by Vietnamese, transliteration, or Cham script filters the dictionary words accurately in real-time.
  - Switching category tabs ("Chào hỏi & Giao tiếp", "Số đếm cổ", etc.) filters words properly.
  - Clearing the search input with the `X` button restores the query to empty.
  - Empty state handles edge case when no words match search/category query.
- [x] **AC 4 (Behavior Preservation - Proverbs & Community Banner)**:
  - All proverbs are rendered with correct Cham script, transliteration, Vietnamese meaning, and philosophical commentary.
  - The community classes banner correctly links to `/tour` with intact styles and copy.
- [x] **AC 5 (Reusability & Extensibility)**: Components accept customizable props (with sensible defaults) so they can be embedded in other pages (e.g. `DigitalHeritagePage`) or standalone widgets.
- [x] **AC 6 (Lint & TypeScript Compliance)**: All created and refactored files pass ESLint and TypeScript compilation without errors or warnings.

---

## 4. Technical Architecture

### Component Hierarchy
```
LanguagePage.tsx
├── Header (global)
├── main
│   ├── LanguageHeroSection
│   ├── AkharBoardSection
│   │   ├── AkharLetterCard (repeating grid)
│   │   └── AkharLetterInspector
│   ├── ChamDictionarySection
│   │   └── DictionaryWordCard (repeating grid)
│   ├── ChamProverbsSection
│   │   └── ProverbCard (repeating grid)
│   └── LanguageCommunityBanner
├── Footer (global)
├── AudioPlayerBar (global)
└── BottomNav (global)
```

---

## 5. Execution Steps
1. Create `frontend/src/components/language/types.ts`
2. Create `frontend/src/components/language/AkharLetterCard.tsx`
3. Create `frontend/src/components/language/AkharLetterInspector.tsx`
4. Create `frontend/src/components/language/AkharBoardSection.tsx`
5. Create `frontend/src/components/language/DictionaryWordCard.tsx`
6. Create `frontend/src/components/language/ChamDictionarySection.tsx`
7. Create `frontend/src/components/language/ProverbCard.tsx`
8. Create `frontend/src/components/language/ChamProverbsSection.tsx`
9. Create `frontend/src/components/language/LanguageHeroSection.tsx`
10. Create `frontend/src/components/language/LanguageCommunityBanner.tsx`
11. Create `frontend/src/components/language/index.ts`
12. Refactor `frontend/src/pages/LanguagePage.tsx`
13. Verify with ESLint and TypeScript checks
