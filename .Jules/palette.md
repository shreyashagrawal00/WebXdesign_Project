## 2025-05-14 - ARIA and Focus States for Navigation Toggles
**Learning:** Icon-only interactive elements, like mobile menu toggles, are often inaccessible to screen readers if they lack descriptive ARIA labels. Additionally, custom-styled buttons frequently miss visible focus indicators, making keyboard navigation difficult.
**Action:** Always provide `aria-label` and `aria-expanded` attributes to navigation toggles. Implement `:focus-visible` styles to ensure accessibility without impacting visual aesthetics for mouse users.
