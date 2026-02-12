## 2025-05-14 - [Form Accessibility and Icon Labels]
**Learning:** React components often omit `htmlFor` on labels and `id` on inputs, which breaks screen reader accessibility. Additionally, icon-only buttons (like mobile menus) are frequently missing `aria-label`, making them unusable for non-visual users.
**Action:** Always verify that every `<label>` has a corresponding `id` on its input and that all interactive elements containing only icons have a descriptive `aria-label`.
