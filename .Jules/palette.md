## 2025-05-15 - Enhancing Form Feedback and Accessibility
**Learning:** For asynchronous authentication forms, a simple "isLoading" state is insufficient without corresponding ARIA attributes. Screen readers need live regions to announce errors, and users benefit from the "disabled" state on all inputs (not just the button) to signify the interface is temporarily inactive.
**Action:** Implement `isLoading` patterns that disable the entire form and use `role="alert"` for dynamic error messages to ensure both visual and auditory clarity.
