## 2025-05-15 - Enhancing Authentication Feedback & Accessibility
**Learning:** In fast-responding or mock environments, transient UI states like "Processing..." can be missed by users but are vital for perceived performance and preventing duplicate actions. Coupling these visual cues with `aria-live="polite"` and `role="alert"` ensures that both sighted and screen-reader users receive consistent feedback on the application's state.
**Action:** Always implement a loading state for async form submissions and use ARIA live regions for dynamic error messages to maintain accessibility.
