## 2025-05-14 - Login Form Accessibility and Feedback
**Learning:** Forms performing asynchronous operations without loading indicators can lead to multiple submissions and user confusion, especially on slower networks. Additionally, error messages without `aria-live` are often missed by screen reader users.
**Action:** Implement `isLoading` states for buttons with visual feedback (spinners) and use `aria-live="polite"` for dynamic error messages.
