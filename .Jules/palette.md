## 2025-05-15 - [Consistent Loading Feedback]
**Learning:** Adding visual loading feedback (spinners and state-dependent text) to authentication forms significantly reduces user uncertainty during network latency and prevents duplicate submissions. Associating labels with inputs via `htmlFor` and `id` is a foundational accessibility requirement that often gets overlooked in rapid development.
**Action:** Always include a `loading` state for any async form submission and ensure all icon-only buttons or interactive elements have descriptive feedback or ARIA labels.
