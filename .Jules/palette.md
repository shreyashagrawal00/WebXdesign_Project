## 2025-03-17 - [Enhanced User Dashboard Sync & Cancellation UX]
**Learning:** Adding a functional sync button with visual loading feedback (rotating icon) significantly improves user confidence in the displayed queue data. Single-page state updates (calling `fetchInitialData` instead of `window.location.reload()`) after destructive actions like cancellation provide a much smoother, app-like experience.
**Action:** Always provide visual feedback (spinners/loading states) for manual refresh actions and prefer local state updates over full page reloads for better UX.

## 2025-03-17 - [Accessible Mobile Interactions]
**Learning:** Mobile menu toggles often lack necessary ARIA attributes, making them unusable for screen reader users. Including `aria-label` and `aria-expanded` is crucial for accessible navigation.
**Action:** Every toggle button must have an explicit `aria-label` describing its action and `aria-expanded` reflecting its current state.
