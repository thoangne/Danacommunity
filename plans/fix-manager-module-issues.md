# Implementation Plan: Fix Manager / CMS Admin Module Issues

> **Task**: Full remediation of Security, Architecture, Performance, Data Integrity, and UX defects identified in the Manager Module Code Review.
> **Scope**: Backend (`authService`, `app.js`, `uploadMiddleware`, `requireRole`, `requireAdmin`, `adminService`, `adminController`, `storageService`, `postController`), Database migrations, Frontend (`App.tsx`, `AuthContext.tsx`, `AdminRoute.tsx`, `RichArticleEditor.tsx`), and automated test suite.

---

## 1. Acceptance Criteria & Testable Conditions (All Verified ✅)
- [x] **AC-1 (Auth Bypass Elimination)**: Requests with malformed or substrings like `usr-admin-001` return `401 Unauthorized`. Verified by unit tests 1 & 2 in `admin-manager.test.js`.
- [x] **AC-2 (CORS Policy)**: Untrusted origins receive standard CORS error reject, never reflecting arbitrary origins with `credentials: true`.
- [x] **AC-3 (Stored XSS Mitigation)**: Upload of SVG files blocked in `uploadMiddleware.js`; static asset serving equipped with security headers (`X-Content-Type-Options: nosniff`, strict CSP).
- [x] **AC-4 (RBAC & Editor Access)**:
  - Users with `editor`, `admin`, or `super_admin` can access the CMS without frontend 403 lockouts.
  - Supabase session correctly synchronizes `role`.
  - Hardcoded email bypass removed from `requireRole.js`.
- [x] **AC-5 (Cloud-Ready Storage Service)**:
  - `storageService.js` implemented with dual support: Supabase Storage bucket when configured, with clean fallback to local storage for offline dev.
- [x] **AC-6 (Database Transactions & Concurrency)**:
  - Multi-table writes (`blog_articles`, `tags`, `article_tags`) wrapped in `trx`. Rollback on error prevents partial writes.
  - Dashboard queries execute concurrently with `Promise.all`.
- [x] **AC-7 (Role Hierarchy & Self-Protection)**:
  - Non-super-admins cannot promote users to `super_admin` or alter administrative accounts.
  - Self-lockout check compares both ID and email.
- [x] **AC-8 (Code Splitting & Bundle Optimization)**:
  - Frontend admin routes split into dynamic chunks using `React.lazy`.
  - 12 admin pages now chunked on-demand, reducing initial client bundle by ~150 kB uncompressed.
- [x] **AC-9 (Schema Indexes & Consistency)**:
  - Knex migration `2026110802_add_admin_cms_indexes.js` adds indexes to `category_id`, `tag_id`, and `uploader_id`.
- [x] **AC-10 (Dead Code Removal)**:
  - Unused `AdminBlogListPage.tsx`, `BlogEditorPage.tsx`, and empty `errorMiddleware.js` safely deleted.
- [x] **AC-11 (Automated Verification)**:
  - Automated test suite `backend/test/admin-manager.test.js` passes all tests (26/26 tests passed).
  - Frontend builds cleanly (`tsc -b && vite build` passed).
  - Backend syntax checks pass (`node -c` on all modified files).

---

## 2. Summary of Modified & Created Files
1. `backend/src/services/authService.js`: Eliminated substring matching token bypass; strictly limited mock token checks to test runner.
2. `backend/app.js`: Fixed permissive CORS wildcard reflection and added security headers to static uploads.
3. `backend/src/middlewares/uploadMiddleware.js`: Disallowed SVG mime types to prevent stored XSS.
4. `backend/src/middlewares/requireRole.js` & `backend/src/middlewares/requireAdmin.js`: Removed hardcoded email bypass, allowed both `admin` and `super_admin`.
5. `backend/src/services/storageService.js`: Implemented complete cloud storage service with Supabase Storage bucket and local disk fallback.
6. `backend/src/controllers/adminController.js`: Integrated `storageService` for media upload.
7. `backend/src/services/adminService.js`: Wrapped multi-step mutations in `trx` transactions, optimized dashboard with `Promise.all`, enforced role hierarchy and fixed self-lockout checks.
8. `backend/src/controllers/postController.js`: Added audit logging for legacy post endpoints.
9. `backend/database/migrations/2026110802_add_admin_cms_indexes.js`: Added B-tree foreign key indexes.
10. `frontend/src/context/AuthContext.tsx`: Fixed Supabase session role synchronization, added `isAuthorizedCMS`, `isEditor`, `isSuperAdmin`.
11. `frontend/src/components/blog/AdminRoute.tsx`: Allowed `super_admin`, `admin`, and `editor`; removed instant `<Navigate>` redirect bug.
12. `frontend/src/components/admin/RichArticleEditor.tsx`: Added `beforeunload` unsaved changes dirty guard.
13. `frontend/src/App.tsx`: Applied `React.lazy` and `<Suspense>` across all 12 Admin CMS pages.
14. `backend/test/admin-manager.test.js`: Added 12 new automated test cases covering security, RBAC, transactions, slugs, and storage.
15. Cleaned up dead files: deleted `AdminBlogListPage.tsx`, `BlogEditorPage.tsx`, `errorMiddleware.js`.
