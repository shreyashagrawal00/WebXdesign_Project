## 2025-05-15 - Dynamic Loading States & ARIA Alerts
**Learning:** In fast-resolving single-page applications, loading states ("Processing...") are crucial for preventing double-form submissions and providing immediate feedback. Using `role="alert"` and `aria-live="polite"` ensures that screen reader users are immediately notified of dynamic error messages without manual navigation.
**Action:** Always wrap dynamic error messages in ARIA live regions and implement `isLoading` states for all primary action buttons that trigger asynchronous operations.
