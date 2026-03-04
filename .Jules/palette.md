## 2025-05-14 - Accessibility and Feedback in Auth Forms
**Learning:** Authentication forms in this application lacked explicit label-to-input linkage and visual/auditory feedback for asynchronous operations. Using `htmlFor` and `id` ensures reliable screen reader navigation, while `role="alert"` on error containers provides immediate feedback without requiring a page refresh.
**Action:** Always audit form components for `htmlFor` associations and implement `isLoading` states on submit buttons to prevent double-submissions and provide visual progress feedback.
