# Implementation Plan: Refactor ProductListPage & Modularization

> **Status**: `COMPLETED`  
> **Author**: Antigravity  
> **Target Date**: 2026-11-14  
> **Risk Level**: `MEDIUM`

---

## 1. Objective
Refactor `frontend/src/pages/ProductListPage.tsx` (1,046 lines) into a modular, clean, and maintainable architecture by decomposing its monolithic inline JSX into dedicated subcomponents under `frontend/src/components/product/`. This addresses code smells (oversized component, mixed concerns, ESLint `set-state-in-effect` and `no-explicit-any` issues) while strictly preserving external behavior, responsive design, styling, and UX contracts.

---

## 2. Scope & Non-Goals

### In Scope
- Decompose `ProductListPage.tsx` into modular subcomponents inside `frontend/src/components/product/`:
  - `types.ts`: Shared TypeScript interfaces and types (`ProductSortOption`, `ProductOrderFormData`).
  - `ProductHeroSection.tsx`: Breadcrumb, header titles, 3 heritage key metrics, hotline contact, and spotlight featured product card.
  - `ProductFilterToolbar.tsx`: Sticky filter toolbar containing category pills, search input with clear trigger, artisan active badge, badge type dropdown, and sort selector.
  - `ProductCard.tsx`: Individual craft item card with image gallery preview trigger, tags, artisan profile link, pricing, and action buttons.
  - `ProductGridSection.tsx`: Results count, reset filters button, empty state, and responsive boutique grid.
  - `ProductCraftProcessSection.tsx`: "Quy trình chế tác độc bản Panduranga" (4 ancestral crafting steps).
  - `ProductCtaSection.tsx`: Custom commissioning and craft tour discovery banner.
  - `ProductQuickViewModal.tsx`: Comprehensive quick view modal with image selector, artisan bio, cultural meaning, dimensions/materials, and crafting workflow.
  - `ProductOrderModal.tsx`: Order / commission inquiry dialog with form validation, submission simulation, and toast feedback.
- Clean up URL search parameters synchronization to eliminate ESLint `react-hooks/set-state-in-effect` error by deriving category and artisan directly from `useSearchParams`.
- Fix TypeScript type casting (`(e.target.value as ProductSortOption)`) to eliminate `@typescript-eslint/no-explicit-any`.
- Reduce `ProductListPage.tsx` from 1,046 lines to < 180 lines.

### Non-Goals (Out of Scope)
- Do not modify backend endpoints or database tables.
- Do not alter visual design, CSS/Tailwind classes, text copy, or asset paths.
- Do not affect unrelated pages or components.

---

## 3. Requirements & Acceptance Criteria
- [x] **AC 1 (Modularization)**: `ProductListPage.tsx` is broken down into clean, single-responsibility components in `frontend/src/components/product/`.
- [x] **AC 2 (URL & Filter Preservation)**: Filtering by category (`?category=...`), artisan (`?artisan=...`), badge, search keyword, and sorting continues to function identically.
- [x] **AC 3 (Spotlight & Quick View Modal)**: Clicking "Xem câu chuyện" on Hero spotlight or the "Eye" / "Chi tiết" buttons on any card opens the Quick View modal with the correct product details, images, and artisan info.
- [x] **AC 4 (Order Commission Modal)**: Clicking "Thỉnh tác phẩm" on cards, modals, or CTA opens the consultation dialog and correctly handles form submission with toast messages.
- [x] **AC 5 (Navigation Links)**: Deep links to `/nghe-nhan#artisan-${id}` and `/tour` function without regression.
- [x] **AC 6 (Lint & Type Verification)**: All new components and `ProductListPage.tsx` pass ESLint and TypeScript checks cleanly.

---

## 4. Component Architecture

```
ProductListPage.tsx (Orchestrator, ~160 lines)
├── Header (global)
├── ProductHeroSection (Breadcrumbs, title, metrics, hotline, spotlight card)
├── ProductFilterToolbar (Sticky categories, search, artisan pill, badges, sort)
├── ProductGridSection (Count, reset button, empty state, grid)
│   └── ProductCard (repeated for filtered items)
├── ProductCraftProcessSection (4-step ancestral process)
├── ProductCtaSection (Bespoke commission & Dana Tour banner)
├── ProductQuickViewModal (Conditional modal: detail gallery, cultural meaning, specs)
├── ProductOrderModal (Conditional modal: inquiry/order form)
├── Footer (global)
├── BottomNav (global)
└── AudioPlayerBar (global)
```

---

## 5. Affected Files
- `frontend/src/components/product/types.ts` (New)
- `frontend/src/components/product/ProductHeroSection.tsx` (New)
- `frontend/src/components/product/ProductFilterToolbar.tsx` (New)
- `frontend/src/components/product/ProductCard.tsx` (New)
- `frontend/src/components/product/ProductGridSection.tsx` (New)
- `frontend/src/components/product/ProductCraftProcessSection.tsx` (New)
- `frontend/src/components/product/ProductCtaSection.tsx` (New)
- `frontend/src/components/product/ProductQuickViewModal.tsx` (New)
- `frontend/src/components/product/ProductOrderModal.tsx` (New)
- `frontend/src/pages/ProductListPage.tsx` (Refactored)
