## 2025-05-14 - Loading States and Accessibility in Auth Forms
**Learning:** Implementing `isLoading` states in authentication forms significantly improves UX by preventing duplicate submissions and providing immediate feedback. Pairing this with ARIA labels and proper label-input associations ensures the form is accessible to screen reader users.
**Action:** Always include `isLoading` states for async buttons and ensure `htmlFor`/`id` parity for all form fields.
