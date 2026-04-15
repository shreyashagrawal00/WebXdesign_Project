## 2025-05-14 - Standardizing Async Feedback
**Learning:** Immediate visual feedback using loading spinners and disabled states prevents duplicate form submissions and reduces user anxiety during network-bound operations in a dark-themed UI. Replacing `window.location.reload()` with asynchronous data refreshes maintains application state and provides a smoother SPA experience.
**Action:** Always implement `isLoading` states for primary action buttons and prefer background data refreshes over full page reloads.
