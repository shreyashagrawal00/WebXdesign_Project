## 2025-03-05 - Accessible Form State Feedback
**Learning:** Adding `role="alert"` and `aria-live="polite"` to error message containers ensures that dynamically rendered authentication errors are immediately announced to screen reader users. Combining this with `isLoading` states and disabled buttons prevents redundant API calls and provides clear visual feedback.
**Action:** Always wrap dynamic error messages in an ARIA-live region and implement `isLoading` states for all asynchronous form submissions.
