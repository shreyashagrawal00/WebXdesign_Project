## 2024-05-24 - Mobile Menu Accessibility & Focus Indicators
**Learning:** React-based mobile menus often miss crucial ARIA attributes like `aria-expanded` and `aria-label`, making them inaccessible to screen readers. Additionally, default focus rings can be inconsistent across browsers or removed by CSS resets, hindering keyboard navigation.
**Action:** Always implement dynamic ARIA attributes for toggle components and define a global `:focus-visible` style to ensure high-contrast focus indicators are present for keyboard users while remaining hidden for mouse users.
