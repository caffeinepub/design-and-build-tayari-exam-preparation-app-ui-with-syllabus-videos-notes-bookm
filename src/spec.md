# Specification

## Summary
**Goal:** Update the profile/header title to show exactly “Tayari” and add a PSC-preparation profile avatar image.

**Planned changes:**
- Replace any occurrence of the phrase “design by build tayari” in the profile/header area with exactly “Tayari” (no extra words).
- Add a new static PSC-preparation illustration image under `frontend/public/assets/generated` and display it as the profile/header avatar with sensible circular/rounded cropping.
- Reference the avatar via a stable `/assets/generated/...` path from the profile UI without introducing any backend fetching.

**User-visible outcome:** The profile/header area displays the title “Tayari” and shows a PSC-preparation themed profile image avatar that renders cleanly on common mobile screen sizes.
