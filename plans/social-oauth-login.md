# Implementation Plan: Google & Facebook OAuth Authentication

> **Status**: `PROPOSED (WAITING_USER_APPROVAL)`  
> **Author**: Antigravity Assistant & Software Engineering Team  
> **Target Date**: 2026-11-08  
> **Risk Level**: `HIGH-RISK` (Authentication, Database Migrations, Account Security)

---

## 1. Objective

Implement complete, secure social authentication for the ChampaWeb platform using:
- **Google Login** (OAuth 2.0 / OpenID Connect authorization code grant).
- **Facebook Login** (OAuth 2.0 authorization code grant).

The feature seamlessly integrates into ChampaWeb's existing Express 5 backend and React 19 frontend architecture, linking social provider accounts with the local `profiles` database table, issuing secure JWT bearer tokens, preventing account takeover, and protecting against CSRF and open redirect vulnerabilities.

---

## 2. Existing Codebase Investigation Findings

| Investigation Area | Source of Truth in Codebase | Architecture Assessment & Decision |
|---|---|---|
| **Frontend Framework** | `frontend/package.json`, `App.tsx` | React 19, TypeScript ~6.0, Vite 8, Tailwind CSS, Radix UI, Sonner. |
| **Backend Framework** | `backend/package.json`, `app.js` | Express 5 (`^5.2.1`), CommonJS, Knex.js (`^3.3.0`) with `pg` driver. |
| **Routing & API Pattern** | `backend/src/routes/` | Routes mounted at `/api` with standard envelope: `{ success: boolean, message: string, data?: any }`. |
| **Current User Model** | `backend/database/migrations/2026110701_create_users_and_profiles.js` | Table `public.profiles` (`id` UUID, `email` VARCHAR(255) UNIQUE, `full_name`, `avatar_url`, `role`, `provider`, `status`). |
| **Current Auth Mechanism** | `backend/src/middlewares/authMiddleware.js`, `frontend/src/context/AuthContext.tsx` | Bearer Token in `Authorization` header. Stored in client `localStorage` (`champa_auth_token` and `champa_auth_user`). |
| **Existing Auth Endpoints** | `backend/src/routes/authRoutes.js` | `POST /register`, `POST /login`, `POST /oauth-callback` (stub), `GET /me`, `POST /logout`. |
| **Existing OAuth State** | `AuthContext.tsx`, `OAuthCallbackPage.tsx` | Contains mock simulation fallback and direct Supabase auth stub. No backend OAuth 2.0 authorization code flow currently implemented. |

---

## 3. Scope & Non-Goals

### In Scope
1. **Database Schema & Migrations**:
   - Reversible Knex migration `2026110801_create_oauth_accounts.js`.
   - Add `email_verified` (BOOLEAN DEFAULT FALSE) to `public.profiles`.
   - Create `public.oauth_accounts` table: `id`, `user_id` (FK to profiles), `provider`, `provider_user_id`, `provider_email`, `created_at`, `updated_at`.
   - Unique constraint `(provider, provider_user_id)` and foreign key index on `user_id`.
   - Update reference consolidated schema in `backend/database/schema_all.sql`.
2. **Backend OAuth Endpoints**:
   - `GET /api/auth/google`: Initiates Google OAuth with secure `state` parameter and PKCE/nonce.
   - `GET /api/auth/google/callback`: Validates `state`, exchanges authorization code for tokens, retrieves Google profile (`sub`, `email`, `email_verified`, `name`, `picture`), creates/links user within a Knex transaction, issues signed JWT, redirects to frontend.
   - `GET /api/auth/facebook`: Initiates Facebook OAuth with secure `state` parameter.
   - `GET /api/auth/facebook/callback`: Validates `state`, exchanges authorization code for tokens, retrieves Facebook profile (`id`, `name`, `email`, `picture`), creates/links user within a Knex transaction, issues signed JWT, redirects to frontend.
   - `GET /api/auth/me`: Enhanced to return user profile including linked OAuth providers.
   - `POST /api/auth/logout`: Clears authentication session and cookies.
3. **Security Protections**:
   - Cryptographically random `state` parameter generated via `crypto.randomBytes(32)` stored in a signed, HttpOnly, SameSite=Lax cookie with 10-minute TTL to prevent CSRF.
   - Open redirect defense: Whitelist validation of `returnTo` URLs (only allowed local origins and sanitized relative paths).
   - Account Linking & Takeover Defense:
     - Never automatically merge accounts if provider email is unverified.
     - For verified provider emails, link to existing account with matching email in `profiles` inside a Knex transaction.
     - Enforce uniqueness of `(provider, provider_user_id)` to prevent duplicate accounts.
   - Token Security: JWT signed with `JWT_SECRET` (HMAC SHA-256) with 7-day expiration. Never expose Client Secrets or provider access tokens to the frontend.
   - Rate limiting: Protect authentication endpoints using an Express rate limiter.
4. **Frontend Integration**:
   - Update `AuthContext.tsx` methods `loginWithGoogle` and `loginWithFacebook` to redirect to backend initiation endpoints with `returnTo` state.
   - Enhance `AuthModal.tsx` and `AuthPage.tsx` social buttons: loading spinners, click debouncing/disabling during requests, brand styling, keyboard accessibility.
   - Enhance `OAuthCallbackPage.tsx` to handle OAuth redirect query params (`token`, `status`, `error`, `returnTo`), fetch `/api/auth/me`, sync state, display toasts, and route user.
5. **Testing Suite**:
   - Automated tests with mocked Google & Facebook provider responses covering all 13 specified test cases.
6. **Documentation**:
   - Comprehensive OAuth documentation at `docs/engineering/oauth-authentication.md`.
   - Update `.env.example` templates.

### Non-Goals (Out of Scope)
- Storing third-party provider access tokens permanently (not needed for basic authentication).
- Replacing standard email/password authentication (both flows will coexist seamlessly).
- Modifying unrelated admin, blog, tour, or booking modules.

---

## 4. Requirements & Acceptance Criteria

- [ ] **AC 1 (Google OAuth Initiation)**: Given an unauthenticated user, when clicking "Continue with Google", the browser redirects to `/api/auth/google`, generates a secure CSRF `state`, and redirects to Google OAuth consent screen requesting `openid email profile`.
- [ ] **AC 2 (Google OAuth Callback Success)**: Given a valid authorization code from Google, backend exchanges code for tokens, verifies `email_verified: true`, finds or creates local user and `oauth_accounts` record within a database transaction, issues JWT, and redirects to frontend `/auth/callback?token=...`.
- [ ] **AC 3 (Facebook OAuth Initiation & Callback)**: Similar to Google, handles Facebook authorization code flow with `email,public_profile` scopes and profile retrieval.
- [ ] **AC 4 (Invalid State / CSRF Rejection)**: Given an invalid, expired, or missing `state` parameter, the backend rejects callback with 403 Forbidden / CSRF error and redirects with error status without creating/linking users.
- [ ] **AC 5 (Account Linking & Unverified Email Safety)**: If a user with the same verified email already exists, link the new provider in `oauth_accounts`. If provider email is unverified, refuse automatic linking to prevent account takeover.
- [ ] **AC 6 (Frontend Experience)**: Both buttons display appropriate branding, loading spinners, prevent double-clicks, display Sonner error toasts on failure/cancellation, and restore the user to their previous route (`returnTo`).
- [ ] **AC 7 (Type & Build Verification)**: `npm run build --prefix frontend` passes with zero errors; modified backend files pass `node -c`.

---

## 5. Technical Design & Architecture

```
[ User Browser ]
       |
       | 1. Clicks "Continue with Google/Facebook"
       v
[ GET /api/auth/google?returnTo=/tour/slug ]
       |
       | 2. Generates crypto state & sets HttpOnly cookie
       | 3. Redirects to Provider Authorization URL
       v
[ Google / Facebook Accounts ]
       |
       | 4. User Approves Consent
       v
[ GET /api/auth/google/callback?code=...&state=... ]
       |
       | 5. Validate state against cookie
       | 6. Exchange code -> access_token (direct backend HTTP POST)
       | 7. Fetch verified user identity (sub/id, email, verified, picture)
       | 8. Knex DB Transaction:
       |    - Find or create oauth_accounts & profiles
       | 9. Issue JWT Token
       | 10. Redirect to FRONTEND_URL/auth/callback?token=...&returnTo=...
       v
[ Frontend /auth/callback ]
       |
       | 11. Stores token in localStorage & calls GET /api/auth/me
       | 12. Updates AuthContext & navigates to returnTo
       v
[ Logged-in Experience ]
```

---

## 6. Implementation Checklist & Tasks

- [ ] **Phase 1: Environment & Branch Setup**
  - Create feature branch: `feature/social-oauth-login`.
  - Update `backend/.env.example`, `.env.example`, and `backend/src/config/env.js` with OAuth variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_CALLBACK_URL`, `JWT_SECRET`, `FRONTEND_URL`, `BACKEND_URL`).
- [ ] **Phase 2: Database Migration**
  - Create `backend/database/migrations/2026110801_create_oauth_accounts.js`.
  - Add `email_verified` to `profiles` and create `oauth_accounts` table.
  - Update `backend/database/schema_all.sql`.
- [ ] **Phase 3: Backend Core Services & OAuth Client**
  - Implement OAuth helper service (`backend/src/services/oauthService.js`): code exchange, profile fetch, state generation/validation.
  - Enhance `backend/src/services/authService.js`: database transaction logic for finding/creating user and linking `oauth_accounts`, JWT generation and verification.
  - Enhance `backend/src/controllers/authController.js`: handlers for initiate, callback, me, logout.
  - Update `backend/src/routes/authRoutes.js`: mount GET `/google`, GET `/google/callback`, GET `/facebook`, GET `/facebook/callback`.
- [ ] **Phase 4: Frontend UI & Callback Integration**
  - Update `frontend/src/context/AuthContext.tsx`: OAuth initiation flow and session recovery.
  - Update `frontend/src/pages/OAuthCallbackPage.tsx`: query parameter parser, token verification, navigation.
  - Update `frontend/src/components/auth/AuthModal.tsx` & `frontend/src/pages/AuthPage.tsx`: loading states, debouncing, error display.
- [ ] **Phase 5: Automated Testing & Verification**
  - Implement comprehensive test suite `backend/test/auth-oauth.test.js` covering all 13 required test cases with mocks.
  - Run frontend build: `npm run build --prefix frontend`.
  - Run backend syntax checks: `node -c`.
- [ ] **Phase 6: Documentation & Review**
  - Create `docs/engineering/oauth-authentication.md`.
  - Perform independent code review against security, correctness, and repo conventions.

---

## 7. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Account Takeover via unverified email** | High | Never link accounts automatically unless `email_verified === true` from trusted provider identity. |
| **CSRF in OAuth callback** | High | Generate cryptographically secure random state (32 bytes hex) and verify against signed HttpOnly cookie with strict 10-minute TTL. |
| **Open Redirect Vulnerability** | Medium | Validate `returnTo` query parameter against a strict whitelist of allowed origins and local relative paths (`/` only, no `//`). |
| **Local dev without real credentials** | Low | Provide mock/dev sandbox test harness for testing OAuth flows without requiring real Google/Facebook production credentials. |

