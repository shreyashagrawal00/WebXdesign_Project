## 2025-05-14 - SPA State Synchronization
**Learning:** Using a centralized `fetchInitialData` function from context to refresh the UI after destructive or background actions (like "Cancel" or "Sync") provides a significantly smoother user experience than `window.location.reload()`, as it preserves component state and avoids unnecessary flicker.
**Action:** Always prefer asynchronous data refreshes via existing context providers over full-page reloads.
