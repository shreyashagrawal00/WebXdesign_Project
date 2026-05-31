## 2026-05-31 - SPA State Refreshes & Real-time Feedback

**Learning:** Using background data fetching (e.g., calling a fetch function) instead of `window.location.reload()` in SPAs prevents jarring flashes and maintains application state. Additionally, wrapping real-time status indicators (like queue tokens) in elements with `role="status"` and `aria-live="polite"` ensures accessibility for screen readers.

**Action:** Prefer asynchronous data refreshes over page reloads. Always use ARIA live regions for critical status updates that change dynamically.
