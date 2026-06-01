## 2026-06-01 - Component-Level CSS for Animations
**Learning:** In repositories with restricted global CSS and no Tailwind, defining keyframes and animation classes locally within a component using a <style> tag is a clean way to add micro-UX animations (like spinners) without affecting the rest of the app.
**Action:** Always check index.css for existing animations first; if missing, define them locally to keep the PR focused and avoid global style pollution.

## 2026-06-01 - ARIA Roles for Live Queue Updates
**Learning:** Using role="status" and aria-live="polite" on queue status cards ensures that screen reader users are automatically notified when "Now Serving" or "Est. Wait" values change, significantly improving accessibility for real-time applications.
**Action:** Identify all dynamic data points in the UI that update without user interaction and wrap them in ARIA status regions.
