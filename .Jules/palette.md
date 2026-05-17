# Palette's UX Journal

Critical learnings only.

## 2025-05-14 - Verifying Transient UI States
**Learning:** In fast-responding mock environments, transient UI states like "Loading" or "Processing" can resolve too quickly for standard automation to capture. Accessibility and UX feedback for these states are critical but often unverified.
**Action:** Use Playwright's `route` interception to delay API responses, allowing for robust verification of loading spinners, disabled states, and ARIA-busy attributes.
