# Tayari Exam Preparation App

## Current State
- Full Motoko backend exists with persistent storage for all subjects: GK, IQ, Second Paper (office management, constitution, maths), Third Paper (service management, accounting, law), old questions, exams, standalone videos/notes, syllabus.
- All backend add/get/delete APIs are working and connected via hooks (useGKManagement, useSecondPaperManagement, useThirdPaperManagement, etc.).
- SubjectContent.tsx renders topics/videos from **static hardcoded content files** (gk.ts, secondPaper.ts, thirdPaper.ts, iq.ts). It does NOT read from the backend at all.
- AdminPanel at /admin has full management forms (GKManagementForm, SecondPaperManagementForm, etc.) — these DO use backend APIs, but users never find them.
- When a new version is deployed, the static content files are overwritten and any previously hardcoded data returns to defaults — dynamic/admin-added data in the backend persists, but the static display doesn't show it.
- Users cannot see Add buttons anywhere in the main subject pages.

## Requested Changes (Diff)

### Add
- Inline "+" Add Video button visible to logged-in admins on every subject's video section (SubjectContent.tsx). Clicking opens a small inline form (topic name + YouTube URL) that submits to the correct backend API.
- Inline "+" Add Note/PDF button visible to logged-in admins on every subject's notes section. Clicking opens a small inline form (title + Google Drive URL) that submits to the correct backend API.
- Backend-loaded videos displayed **below** the static hardcoded videos in each subject, fetched from the appropriate backend query (e.g. getGKVideos for GK page, getSecondPaperVideos for Second Paper pages, etc.).
- Backend-loaded notes URLs appended to the existing static notesUrls so they are shown in DriveViewer.
- Similar inline Add buttons on: OldQuestions page, Exam page, Syllabus page.
- A mapping from subject ID to the correct backend hook so each subject page reads/writes the right data.

### Modify
- SubjectContent.tsx: Accept optional backend hook props or derive which hook to use from `config.id`. Load backend videos and notes in addition to static content. Show Add buttons for admins.
- OldQuestions.tsx: Add inline admin Add button to add new old question entries to backend.
- Exam.tsx: Add inline admin Add button to add new mock exam entries to backend.
- Syllabus.tsx: Add inline admin Add button to add new syllabus entries to backend.

### Remove
- Nothing removed — static content remains as seed data visible to all users.

## Implementation Plan
1. Create a `useSubjectBackend` hook that accepts a subject ID and returns the correct backend data (videos, notes) and add/delete functions by mapping subject ID to existing management hooks.
2. Update SubjectContent.tsx to:
   - Call useSubjectBackend(config.id)
   - Merge backend videos into the topic list display (show as a separate "Added Videos" section or append to existing topics)
   - Merge backend notes URLs into allNotesUrls
   - Show an admin-only inline Add Video form (topic name + YouTube URL) and Add Note form (title + Drive URL)
3. Update OldQuestions, Exam, Syllabus pages to show admin inline add forms using existing hooks.
4. Ensure all add actions call the correct backend mutation and invalidate queries so new content appears immediately without page reload.
