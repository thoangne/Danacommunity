# Implementation Plan: Refactoring TourListPage UI Decomposition

> **Task Category**: Refactoring  
> **Target**: `frontend/src/pages/TourListPage.tsx`  
> **Risk Tier**: MEDIUM (Internal UI component decomposition, non-breaking, behavior-preserving)

---

## 1. Problem & Motivation
`TourListPage.tsx` is currently a single monolithic file (363 lines) containing:
- Hero banner with breadcrumb & marketing badge
- Complex tour showcase card with multi-column layout, media, itinerary schedule, highlights, price and CTA
- 8 heritage stations commentary showcase grid
- Trust & reassurance guarantees banner

This creates unnecessary cognitive overhead and violates single responsibility. Modularizing this into domain components under `frontend/src/components/tour/` makes each section readable, maintainable, and reusable across the application.

---

## 2. Invariants & Scope Boundaries
- **Preserve 100% of visual UI and functional behavior**:
  - Exact layout, Tailwind classes, responsive breakpoints, animations, and typography.
  - Same routing paths (`/`, `/tour/:slug`, `/tour/:slug#thuyet-minh-di-san`, `/bai-viet/thuyet-minh-du-lich-cong-dong-palei-baoh-dana`).
  - Same header audio toggling state (`isAudioPlaying`, `onToggleAudio`).
  - Image fallback behavior for stations.
- **Backward Compatibility**:
  - `TourListPage` default export preserved for `App.tsx`.
- **Zero modification to unrelated files**:
  - Only touch `frontend/src/pages/TourListPage.tsx` and create files under `frontend/src/components/tour/`.

---

## 3. Component Decomposition Architecture

We will extract the sections into dedicated components under `frontend/src/components/tour/`:

1. **`TourHeroSection.tsx`**:
   - Hero banner with gradient effects, breadcrumbs, archival tag, sparkles badge, h1 title, and subtitle.
2. **`TourItineraryTimeline.tsx`**:
   - Static/customizable timeline steps (07:30 - 16:30) displaying timestamps, titles, and activity descriptions.
3. **`TourShowcaseCard.tsx`**:
   - Left column: image, badges, rating, duration, header.
   - Right column: location, group size, tour title, description, itinerary timeline (`TourItineraryTimeline`), highlights chips, and price CTA.
   - Accepts prop: `tour: Tour`.
4. **`TourStationsShowcase.tsx`**:
   - 8 Heritage Waypoint Commentary Showcase.
   - Header with link to full article.
   - Grid of 8 station cards with fallback image handling and link to detail anchor.
   - Accepts props: `stations: TourGuideStation[]`, `tourSlug: string`.
5. **`TourTrustSection.tsx`**:
   - Reassurance guarantees banner (100% Nghệ Nhân Bản Địa, Bảo Hiểm & Đưa Đón).

---

## 4. Verification Plan
1. ESLint verification on all newly created and modified files:
   - `./frontend/node_modules/.bin/eslint frontend/src/components/tour/*.tsx frontend/src/pages/TourListPage.tsx`
2. TypeScript compilation check:
   - Verify no new TypeScript errors introduced in `frontend/src/pages/TourListPage.tsx` and `frontend/src/components/tour/`.
3. Code review self-audit against `.codex/workflows/code-review.md`.
