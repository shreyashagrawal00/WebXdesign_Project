## 2026-05-22 - SPA State Refresh Pattern
**Learning:** In a React-based queue management system, replacing disruptive full-page reloads (`window.location.reload()`) with context-aware data refreshes (e.g., `fetchInitialData()`) significantly improves the perceived responsiveness and accessibility.
**Action:** Always prefer asynchronous state updates paired with localized loading indicators (spinners/disabled buttons) to maintain the application's flow and provide immediate feedback for background operations.
