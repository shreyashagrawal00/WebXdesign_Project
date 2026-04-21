## 2026-04-21 - Standardizing Async Form Feedback
**Learning:** For fast-resolving APIs, visual loading states can feel like a "flicker" unless handled with CSS transitions or intentional delay, but for accessibility, immediate feedback via `aria-live` is crucial regardless of the visual duration.
**Action:** Use a global `.animate-spin` utility for consistency and always pair it with `role="alert"` or `aria-live` on the status container to ensure screen readers capture the state change.
