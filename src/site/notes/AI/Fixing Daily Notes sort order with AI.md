---
dg-publish: true
permalink: /ai/fixing-daily-notes-sort-order-with-ai/
tags:
  - AI
dg-path: AI/Fixing Daily Notes sort order with AI
aliases:
  - Changed the sort order of my daily notes
  - programmatically sorted and displayed from newest to oldest
  - AI/Fixing Daily Notes sort order with AI
---

# Fixing Daily Notes Sorting

## The Problem
The daily notes in our digital garden weren't displaying in the correct order on the live site. Initially, we tried several approaches to fix this:

1. **Frontmatter Dates**: We attempted to use the `created` dates in the frontmatter, but this wasn't reliable as not all notes had these dates set.

2. **File System Dates**: We tried using the file system's modification dates, but this proved inconsistent across different environments.

3. **Full Path Sorting**: Our first attempt at using `fileSlug` for sorting compared the entire path (e.g., "Daily Notes/2025-03-20"), which didn't work as expected because it was comparing the full path strings rather than just the dates.

## The Solution
The breakthrough came when we realized we needed to extract just the date portion from the fileSlug. Here's what we did:

1.  ### **Path Check**:
We improved the check for daily notes by removing the leading slash from the path check:
```javascript
const isADailyNote = a.filePathStem.includes('Daily Notes/');
```

2. ### **Date Extraction**: We modified the sorting to extract just the date part from the fileSlug:
```javascript
const dateA = a.fileSlug.split('/').pop();
const dateB = b.fileSlug.split('/').pop();
return dateB.localeCompare(dateA);
```

This solution works because:
- It only sorts notes within the Daily Notes directory
- It extracts just the YYYY-MM-DD portion of the filename
- It uses `localeCompare` to properly sort the dates in reverse order (newest first)
- It's consistent across all environments since it relies on the filename format

## Key Learnings
1. Sometimes the simplest solution is the best - using the filename format we already had in place
2. When sorting, it's important to compare exactly what we want to sort by (just the dates) rather than the full context
3. The `fileSlug` property in Eleventy can be manipulated to extract specific parts of the path

## Result
The daily notes are now properly sorted by date, with the newest notes appearing first, making it easier to navigate through the chronological content. 