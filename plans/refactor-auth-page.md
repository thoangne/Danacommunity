# Implementation Plan: Refactor AuthPage & Modularize Auth Components

## 1. Overview & Objectives
- **Target File**: `frontend/src/pages/AuthPage.tsx` (596 lines).
- **Goal**: Refactor the auth page interface by decomposing it into modular, well-encapsulated, and reusable components under `frontend/src/components/auth/`.
- **Scope**:
  - Extract reusable presentation & input components.
  - Extract password strength calculation utility.
  - Simplify `AuthPage.tsx` into a clean orchestrator while preserving 100% of its visual design, animations, behaviors, responsive layouts, and routing logic.
- **Risk Tier**: MEDIUM (Internal component refactor, non-breaking, behavior-preserving).

---

## 2. Acceptance Criteria
1. **Behavior Preservation**:
   - Routes `/dang-nhap`, `/login`, `/dang-ky`, `/register` continue functioning identically.
   - Login, Register, and Forgot Password form submissions behave exactly as before.
   - Google & Facebook OAuth triggers work with the same loading states and callbacks.
   - Password strength meter displays accurate score (0–4) and labels.
   - Form field validations (email regex, password length >= 6, password matching, required fields) remain intact.
2. **Component Reusability**:
   - Reusable components reside in `frontend/src/components/auth/`.
   - Components can be reused in other authentication touchpoints (such as `AuthModal.tsx` or settings pages).
3. **Code Quality & Cleanliness**:
   - Clean TypeScript typing with no `any`.
   - `AuthPage.tsx` line count reduced substantially (target: < 200 lines).
   - Zero ESLint errors introduced.

---

## 3. Modular Architecture

New components in `frontend/src/components/auth/`:
1. `types.ts`: Shared types (`AuthMode`, `SocialProvider`, `PasswordStrength`, etc.).
2. `passwordUtils.ts`: Pure functions `calculatePasswordStrength(password)` and `getStrengthLabel(strength)`.
3. `AuthBrandHero.tsx`: Heritage brand showcase column (responsive, configurable for page vs modal).
4. `SocialAuthButtons.tsx`: Google and Facebook sign-in buttons with loading spinners and divider.
5. `PasswordStrengthIndicator.tsx`: 4-segment visual strength bar with dynamic colors and label.
6. `AuthHeader.tsx`: Title, subtitle, and optional back-to-login button.
7. `AuthInputField.tsx`: Reusable text/password input with icon prefix, trailing toggle/valid icon, and styling.
8. `AuthAlert.tsx`: Error and success alerts.
9. `AuthLegalNotice.tsx`: Terms of service and privacy policy disclaimer.
10. `index.ts`: Barrel export for clean imports.

---

## 4. Verification Plan
1. Static Type Checking: Run `./frontend/node_modules/.bin/tsc --noEmit -p frontend/tsconfig.app.json` on auth components and verify no type errors.
2. Lint Verification: Run `./frontend/node_modules/.bin/eslint` on all newly created components and `AuthPage.tsx`.
3. Visual & Functional Inspection: Verify all elements (icons, inputs, validation, responsive layouts) match previous behavior.
