## 2025-05-15 - Loading State Pattern
**Learning:** Adding a loading state to buttons that trigger asynchronous operations (like Login/Register) significantly improves UX by providing immediate visual feedback and preventing accidental multiple submissions. Using a spinner icon like `Loader2` from `lucide-react` with a rotating animation is a clear, standard way to communicate "processing".
**Action:** Always include `isLoading` states for form submissions and disable the submit button and inputs while the operation is in progress.
