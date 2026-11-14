# Implementation Plan: Refactor DigitalHeritagePage Component & Modularization

> **Status**: `COMPLETED`  
> **Author**: Antigravity  
> **Target Date**: 2026-11-14  
> **Risk Level**: `MEDIUM`

---

## 1. Objective
Refactor `frontend/src/pages/DigitalHeritagePage.tsx` (715 lines) into a modular, clean, and reusable component architecture within `frontend/src/components/digital-heritage/`. This decomposition isolates domain logic, enhances UI readability and reusability, and reduces cognitive load while strictly preserving existing UI/UX behavior, URL query parameters, and accessibility.

---

## 2. Scope & Non-Goals

### In Scope
- Decompose monolithic `DigitalHeritagePage.tsx` into focused subcomponents:
  - `types.ts`: Shared TypeScript definitions for tabs and component props.
  - `DigitalHeritageHero.tsx`: Archival breadcrumb, badge, title typography, and 3-tab navigation switcher.
  - `PhotoGallerySection.tsx`: Tab 1 container with category filtering and photo counter.
  - `GalleryPhotoCard.tsx`: Reusable archival photo card with hover preview and curator indicator.
  - `PhotoLightboxModal.tsx`: High-resolution photo inspection modal with carousel navigation and curator metadata.
  - `AkharBoardSection.tsx`: Tab 2 interactive Akhar Thrah alphabet grid, pronunciation playback trigger, and letter detail inspector.
  - `ChamDictionarySection.tsx`: Tab 2 mini-dictionary with bilingual Cham-Vietnamese search and category filters.
  - `InscriptionsSection.tsx`: Tab 3 archaeological stone stele inscription showcase.
  - `InscriptionCard.tsx`: Reusable epigraphical inscription card with bilingual translation snippets.
- Refactor `DigitalHeritagePage.tsx` to act purely as a high-level coordinator (< 120 lines; achieved 82 lines).
- Ensure strict TypeScript typing with zero `any` types.
- Ensure ESLint passes with 0 new errors.

### Non-Goals (Out of Scope)
- Do not modify backend endpoints or database schemas.
- Do not alter visual design tokens, layout hierarchy, or copy.
- Do not touch unrelated files in the repository.

---

## 3. Requirements & Acceptance Criteria

- [x] **AC 1 (Page Orchestrator Simplification)**: `DigitalHeritagePage.tsx` is reduced from 715 lines to under 120 lines (achieved 82 lines), orchestrating modular components.
- [x] **AC 2 (URL Query Sync)**: Selecting tabs updates `?tab=hinh-anh | ngon-ngu | van-bia` via `useSearchParams` and directly reflects the URL state.
- [x] **AC 3 (Photo Gallery & Filter)**: Category filter tabs accurately filter photos from `GALLERY_PHOTOS`, displaying correct active count and item cards.
- [x] **AC 4 (Photo Lightbox Navigation)**: Clicking any photo opens the Lightbox modal. Previous, next, close, ESC key, and wraparound navigation work smoothly.
- [x] **AC 5 (Akhar Alphabet Interaction)**: Clicking letters updates the active letter preview; vowel/consonant filters correctly toggle the displayed letter set; clicking audio button triggers `toast.info` with pronunciation details.
- [x] **AC 6 (Cham Dictionary Search)**: Real-time search by Vietnamese meaning, Cham script, or Latin transliteration filters the word list dynamically; category filters function properly.
- [x] **AC 7 (Inscriptions Rendering)**: All digital stone inscriptions render with code, language, transliteration, and Vietnamese translation.
- [x] **AC 8 (Audio Player Integration)**: Header audio toggle and `AudioPlayerBar` continue to operate seamlessly.
- [x] **AC 9 (Code Quality & Build)**: TypeScript check passes without errors in the refactored files and ESLint produces zero new warnings or errors (0 errors, 0 warnings).

---

## 4. Technical Approach

### Architecture & Component Tree
```
DigitalHeritagePage.tsx (Coordinator - 82 lines)
├── Header (global)
├── DigitalHeritageHero
│   └── Tab Switcher ("hinh-anh" | "ngon-ngu" | "van-bia")
├── [Active Tab View]
│   ├── (tab === "hinh-anh"): PhotoGallerySection
│   │   ├── GalleryPhotoCard (repeated)
│   │   └── PhotoLightboxModal (conditional on activePhoto !== null)
│   ├── (tab === "ngon-ngu"):
│   │   ├── AkharBoardSection
│   │   └── ChamDictionarySection
│   └── (tab === "van-bia"): InscriptionsSection
│       └── InscriptionCard (repeated)
├── Footer (global)
├── AudioPlayerBar (global)
└── BottomNav (global)
```

---

## 5. Affected Files & Modules
- [`plans/refactor-digital-heritage-page.md`](file:///Users/thoangnn/dev/Project/ChampaWeb/plans/refactor-digital-heritage-page.md)
- [`frontend/src/components/digital-heritage/types.ts`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/types.ts)
- [`frontend/src/components/digital-heritage/DigitalHeritageHero.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/DigitalHeritageHero.tsx)
- [`frontend/src/components/digital-heritage/GalleryPhotoCard.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/GalleryPhotoCard.tsx)
- [`frontend/src/components/digital-heritage/PhotoGallerySection.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/PhotoGallerySection.tsx)
- [`frontend/src/components/digital-heritage/PhotoLightboxModal.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/PhotoLightboxModal.tsx)
- [`frontend/src/components/digital-heritage/AkharBoardSection.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/AkharBoardSection.tsx)
- [`frontend/src/components/digital-heritage/ChamDictionarySection.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/ChamDictionarySection.tsx)
- [`frontend/src/components/digital-heritage/InscriptionCard.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/InscriptionCard.tsx)
- [`frontend/src/components/digital-heritage/InscriptionsSection.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/InscriptionsSection.tsx)
- [`frontend/src/components/digital-heritage/index.ts`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/components/digital-heritage/index.ts)
- [`frontend/src/pages/DigitalHeritagePage.tsx`](file:///Users/thoangnn/dev/Project/ChampaWeb/frontend/src/pages/DigitalHeritagePage.tsx)
