## 2025-01-24 - Smooth SPA State Synchronization
**Learning:** Using `window.location.reload()` in a Single Page Application (SPA) is disruptive and clears non-persistent state. Background data fetching combined with localized loading indicators (using `aria-live` and `role="status"`) provides a much smoother "app-like" experience while keeping the user informed of background activity.
**Action:** Replace full-page reloads with targeted context/state refreshes and provide granular loading feedback for async actions.

## 2025-01-24 - Communicating Toggle States
**Learning:** Mobile navigation toggles are often inaccessible if they only rely on visual icons. Screen readers need explicit `aria-expanded` states to communicate whether a menu is open.
**Action:** Ensure all toggleable interactive elements use `aria-expanded` and descriptive `aria-label`s.
