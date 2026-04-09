## 2025-04-09 - Transient UI States and Loading Feedback
**Learning:** In applications with fast-resolving mock APIs, users may not perceive state changes without explicit visual feedback like loading spinners. This can lead to frustration or accidental multiple form submissions.
**Action:** Always implement `isLoading` states for asynchronous operations, using a spinner (e.g., `Loader2`) and disabling the trigger button to provide clear feedback and prevent race conditions.

## 2025-04-09 - Mobile Navigation Accessibility
**Learning:** Icon-only toggles for mobile menus are frequently inaccessible to screen readers because they lack descriptive labels and state information.
**Action:** Use `aria-label` to describe the button's purpose and `aria-expanded` to communicate whether the menu is currently open or closed.
