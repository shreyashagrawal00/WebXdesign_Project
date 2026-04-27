## 2025-05-14 - Interactive Feedback for Async Actions
**Learning:** Transitioning from full-page reloads (`window.location.reload()`) to asynchronous background refreshes significantly improves the perceived performance and "Single Page Application" feel. Users benefit from localized loading indicators (like "Cancelling...") which provide immediate confirmation that their action was registered.
**Action:** Always prefer updating local state or re-fetching data via hooks/context over reloading the entire application. Pair these actions with clear visual feedback on the triggering element.
