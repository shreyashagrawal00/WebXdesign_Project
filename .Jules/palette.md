## 2025-05-15 - Visual Feedback for Async Operations
**Learning:** Asynchronous operations like authentication without immediate visual feedback can lead to user uncertainty and multiple form submissions. Adding a loading spinner and changing button text to "Processing..." provides clear feedback that the system is working.
**Action:** Prioritize implementing `isLoading` states for all buttons triggering network requests to improve perceived performance and prevent duplicate submissions.
