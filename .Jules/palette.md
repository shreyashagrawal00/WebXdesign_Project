## 2024-05-20 - Smooth Dashboard Transitions
**Learning:** Hard page reloads (`window.location.reload()`) are disruptive in SPAs. Localized loading states paired with context-level data fetching provide a much smoother user experience.
**Action:** Use `fetchInitialData` or similar async hooks with local `isLoading` states instead of `location.reload()` to refresh UI after actions.
