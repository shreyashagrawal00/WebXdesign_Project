## 2025-05-15 - [Focused Micro-UX: Reusing Design Tokens for Feedback]
**Learning:** For micro-UX improvements like loading states, it is critical to reuse existing design tokens (such as CSS animations) rather than injecting custom styles, even via inline tags. This maintains design consistency and adheres to "no custom CSS" constraints while keeping the implementation focused and lightweight.
**Action:** When adding loading feedback, check for existing animation classes (like `logo-spin` in `App.css`) and reuse them to provide intuitive visual cues without increasing code complexity.
