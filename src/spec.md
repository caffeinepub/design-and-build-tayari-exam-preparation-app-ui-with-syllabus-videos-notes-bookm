# Specification

## Summary
**Goal:** Improve the app’s branding consistency, visual theme/colors, video discoverability, dashboard course visuals, Nepali UI text coverage, and correct the Exam module’s First Paper option.

**Planned changes:**
- Add support for an optional custom app logo from a static asset path and render it on the Splash screen and Dashboard header, with a safe fallback to the existing logo when missing.
- Update dominant background gradients across key pages (Dashboard, SubjectContent, Exam, OldQuestions, VideoBookmarks, NotesBookmarks) to a more cohesive, attractive palette and avoid blue/indigo-heavy mixes.
- Add video search inputs to SubjectContent video lists (filtering by topic titles and video titles) and to the VideoBookmarks page (filter by video title), including a clear empty-state message when no results match.
- Enhance the Dashboard “Kharidar Courses” section to show 3–4 static course thumbnails in a compact, responsive layout suitable for mobile.
- Replace remaining English UI labels in the specified areas with Nepali (or bilingual where needed), including paper labels, Old Questions, Bookmarks, Exam labels, common actions, and empty states.
- Fix the Exam module to include a First Paper option and ensure it does not display/match Second Paper content; if First Paper URLs are not configured, show “Coming soon” and prevent starting it.

**User-visible outcome:** Users see consistent branding (including their own logo if provided), improved background colors, can search videos and bookmarked videos by keyword, see course thumbnails on the dashboard, get Nepali UI labels across key areas, and can correctly select First/Second/Third Paper exams with First Paper handled as “Coming soon” when unavailable.
