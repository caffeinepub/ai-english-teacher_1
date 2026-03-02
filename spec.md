# Specification

## Summary
**Goal:** Wire up the existing "Continue with Google" button on the Login page to the Internet Identity authentication flow, handle post-login profile creation, and ensure the login page is fully responsive.

**Planned changes:**
- Connect the "Continue with Google" button on LoginPage to the `useInternetIdentity` hook so it triggers actual authentication.
- Show a loading/disabled state on the button while authentication is in progress.
- Display a visible error message (toast or inline) if authentication fails.
- After successful login, check if a profile exists for the authenticated principal; if not, prompt the user to enter a display name and email to create one.
- If a profile already exists for the principal, skip creation and redirect directly to `/dashboard`.
- Enforce profile uniqueness by principal ID in the backend (`backend/main.mo`).
- After profile creation or confirmation, redirect the user to `/dashboard`.
- Ensure the login page layout and button are fully responsive at 320px, 768px, and 1280px viewports with adequate tap target size on mobile.

**User-visible outcome:** Users can click "Continue with Google" on the login page to authenticate via Internet Identity, get prompted to complete their profile on first login, and are redirected to the dashboard — with proper loading and error feedback throughout.
