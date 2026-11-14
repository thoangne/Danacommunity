# Implementation Plan: Refactor ArtisansPage Component & Modularization

> **Status**: `COMPLETED`  
> **Author**: Antigravity  
> **Target Date**: 2026-11-14  
> **Risk Level**: `MEDIUM`

---

## 1. Objective
Refactor `frontend/src/pages/ArtisansPage.tsx` (739 lines) into a clean, modular, and maintainable architecture by decomposing its inline sections into dedicated reusable components in `frontend/src/components/artisans/`, improving code readability, dynamic data binding, and testability while strictly preserving existing UI/UX behavior and deep link contracts.

---

## 2. Scope & Non-Goals
### In Scope
- Decompose monolithic `ArtisansPage.tsx` into modular subcomponents:
  - `ArtisansHeroSection.tsx`: Breadcrumb, title, descriptive copy, and 4 heritage key metrics.
  - `ArtisansVillageFilter.tsx`: Sticky filter tabs with dynamically computed artisan counts per village.
  - `ArtisanCard.tsx`: Editorial asymmetric layout showcasing artisan portrait, hands badge, bio, quote, achievements, workshop info, and related craft products.
  - `ArtisansListSection.tsx`: List coordinator rendering filtered artisans with anchor targets.
  - `ArtisanWorkshopsSection.tsx`: Practical craft workshops (Bàu Trúc, Mỹ Nghiệp, Hữu Đức) with structured mapping to artisans.
  - `ArtisansCTASection.tsx`: Call to action banner linking to tour packages and heritage craft store.
  - `ArtisanBookingModal.tsx`: Booking dialog with form validation, state management, and toast notifications.
  - `types.ts`: TypeScript contracts for booking form state and workshop specifications.
- Clean up hash navigation (`#artisan-1`, etc.) to ensure reliable smooth scrolling.
- Compute village filter tab counts dynamically from `ARTISANS` data instead of relying on hardcoded numbers.
- Ensure 100% type safety and strict lint compliance (`eslint` passing with 0 errors).

### Non-Goals (Out of Scope)
- Do not modify database schemas or backend APIs.
- Do not change visual layout, Tailwind design system tokens, or copy text.
- Do not modify unrelated files in `frontend` or `backend`.

---

## 3. Requirements & Acceptance Criteria
- [x] **AC 1 (Modularization)**: `ArtisansPage.tsx` is reduced from 739 lines to 118 lines, acting as a clean orchestrator for dedicated subcomponents in `frontend/src/components/artisans/`.
- [x] **AC 2 (Behavior Preservation - Deep Links)**: Navigating to `/nghe-nhan#artisan-${id}` smoothly scrolls the viewport to center the target artisan card.
- [x] **AC 3 (Behavior Preservation - Village Filter)**: Filtering by village ("Tất cả", "Gốm Bàu Trúc", "Dệt Mỹ Nghiệp", "Âm nhạc Hữu Đức") accurately updates the displayed artisan cards.
- [x] **AC 4 (Dynamic Tab Counts)**: Village filter tab counts are computed dynamically from `ARTISANS` data.
- [x] **AC 5 (Booking Modal)**: Clicking "Đặt hẹn ghé thăm xưởng" on an artisan card or "Đăng ký" on a workshop card opens the booking modal with appropriate default values.
- [x] **AC 6 (Form Validation & Submission)**: Submitting with missing required fields triggers a warning toast; valid submissions trigger a success toast and close the modal.
- [x] **AC 7 (Product Showcase)**: Products related to each artisan are rendered accurately with thumbnail, title, price estimate, and links.
- [x] **AC 8 (Lint & Types)**: All created and refactored files pass ESLint and TypeScript checks without errors or warnings.

---

## 4. Technical Approach

### Architecture & Component Tree
```
ArtisansPage.tsx (~118 lines)
├── Header (global)
├── ArtisansHeroSection
├── ArtisansVillageFilter
├── ArtisansListSection
│   └── ArtisanCard (repeated per artisan)
├── ArtisanWorkshopsSection
├── ArtisansCTASection
├── ArtisanBookingModal (conditional dialog)
├── Footer (global)
├── BottomNav (global)
└── AudioPlayerBar (global)
```

---

## 5. Affected Files & Modules
- `frontend/src/components/artisans/types.ts` (New)
- `frontend/src/components/artisans/ArtisansHeroSection.tsx` (New)
- `frontend/src/components/artisans/ArtisansVillageFilter.tsx` (New)
- `frontend/src/components/artisans/ArtisanCard.tsx` (New)
- `frontend/src/components/artisans/ArtisansListSection.tsx` (New)
- `frontend/src/components/artisans/ArtisanWorkshopsSection.tsx` (New)
- `frontend/src/components/artisans/ArtisansCTASection.tsx` (New)
- `frontend/src/components/artisans/ArtisanBookingModal.tsx` (New)
- `frontend/src/components/artisans/index.ts` (New barrel export)
- `frontend/src/pages/ArtisansPage.tsx` (Refactored)

---

## 6. Implementation Checklist
- [x] **Stage 1 & 2**: Analyze existing `ArtisansPage.tsx`, dependencies, deep links, and code smells.
- [x] **Stage 3**: Define invariants and create plan `plans/refactor-artisans-page.md`.
- [x] **Stage 4.1**: Create `frontend/src/components/artisans/types.ts`.
- [x] **Stage 4.2**: Create `ArtisansHeroSection.tsx`.
- [x] **Stage 4.3**: Create `ArtisansVillageFilter.tsx` with dynamic badge counts.
- [x] **Stage 4.4**: Create `ArtisanCard.tsx` and `ArtisansListSection.tsx`.
- [x] **Stage 4.5**: Create `ArtisanWorkshopsSection.tsx`.
- [x] **Stage 4.6**: Create `ArtisansCTASection.tsx`.
- [x] **Stage 4.7**: Create `ArtisanBookingModal.tsx`.
- [x] **Stage 4.8**: Update `frontend/src/pages/ArtisansPage.tsx` to assemble all subcomponents.
- [x] **Stage 5**: Verify build and linting checks (`eslint`, `vite build`).
- [x] **Stage 6**: Code review and final summary report.
