## 2025-05-15 - Non-blocking UI State Refresh
**Learning:** Replacing `window.location.reload()` with asynchronous background data fetching significantly improves the perceived performance and "feel" of a Single Page Application (SPA). However, it requires explicit state management (`isLoading`) to prevent users from triggering multiple concurrent requests while the background sync is in progress.
**Action:** Always pair background data refreshes with localized loading indicators (spinners) and disabled button states to provide immediate feedback and maintain data integrity.
