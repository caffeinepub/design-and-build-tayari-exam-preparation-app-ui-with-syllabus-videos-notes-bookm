# Specification

## Summary
**Goal:** Update the app’s displayed logo to a new 3D education-themed globe PNG and slightly enlarge the specified container div so it appears a bit bigger than the YouTube player.

**Planned changes:**
- Add/replace the logo PNG asset in frontend static assets and update the selected logo `<img>` (XPath `/html[1]/body[1]/div[1]/div[1]/div[1]/div[1]/img[1]`) to render the new 3D globe + graduation cap PNG wherever that selected logo is shown.
- Adjust styling for the selected container div (XPath `/html[1]/body[1]/div[1]/div[1]/main[1]/section[1]/div[1]`) to make it visually slightly larger than the embedded YouTube player on the same screen, without introducing overflow or horizontal scrolling.

**User-visible outcome:** The logo shown in the app updates to a 3D globe-with-graduation-cap PNG, and the targeted div section appears slightly more prominent than the YouTube player while the rest of the layout remains unchanged.
