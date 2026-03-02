## 2025-03-02 - Accessible Mobile Navigation and Global Focus States
**Learning:** Screen reader users need explicit signals (ARIA attributes) to understand the state and purpose of interactive elements like mobile menu toggles. Keyboard users require clear visual feedback (focus states) to navigate without a mouse.
**Action:** Always include `aria-label`, `aria-expanded`, and `aria-controls` for toggle buttons, and implement global `:focus-visible` styles to ensure high-visibility focus indicators that only appear for keyboard interactions.
