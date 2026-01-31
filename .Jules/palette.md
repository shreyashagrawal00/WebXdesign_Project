## 2025-05-14 - [Improve Login Accessibility and Feedback]
**Learning:** Even simple forms can often lack basic accessibility features like label/input association and ARIA roles for errors. Providing visual feedback during async operations (like a loading state on a submit button) prevents user frustration and accidental multiple submissions.
**Action:** Always ensure labels use `htmlFor` linked to input `id`s, and provide explicit loading states for all form submissions.
