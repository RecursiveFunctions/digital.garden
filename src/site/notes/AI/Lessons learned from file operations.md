---
dg-publish: true
dg-path: AI/Lessons learned from file operations
permalink: /ai/lessons-learned-from-file-operations/
noteIcon: ""
created: 2024-03-21T02:30:00.000-04:00
updated: 2024-03-21T02:30:00.000-04:00
aliases:
  - update its rules
tags:
  - AI
---

# Lessons Learned from File Operations

## PowerShell vs Unix Commands
When working with file operations in PowerShell, there are several important differences from Unix commands that need to be considered:

### Command Chaining
- **Bad**: Using Unix-style command chaining with `&&`
  ```powershell
  mv file1.md file2.md && mv file3.md file4.md
  ```
- **Good**: Run commands separately or use PowerShell's semicolon
  ```powershell
  Move-Item file1.md file2.md; Move-Item file3.md file4.md
  ```

### Directory Creation
- **Bad**: Using Unix-style `mkdir -p`
  ```powershell
  mkdir -p "src/site/notes/Linux/etc files"
  ```
- **Good**: Using PowerShell's `New-Item` command
  ```powershell
  New-Item -ItemType Directory -Path "src/site/notes/Linux/etc files" -Force
  ```

### File Movement
- **Bad**: Using Unix-style `mv` command
  ```powershell
  mv "file with spaces.md" "new location/"
  ```
- **Good**: Using PowerShell's `Move-Item` command with proper quoting
  ```powershell
  Move-Item "file with spaces.md" "new location/"
  ```

## Git Operations
When moving files around in a git repository, there are several important considerations:

### Checking Status
Always check `git status` before committing to see:
- Deleted files (shown in red)
- Untracked files (shown in green)
- Modified files (shown in yellow)

### Staging Changes
When moving files, you need to stage both:
- The new files in their new location
- The deleted files in their old location

### Commit Messages
Write descriptive commit messages that include:
- What was changed
- Where files were moved (if applicable)
- Why the change was made

Example of a good commit message:
```
Move files from raw_notes to notes directory: moved OSI Model.md and scp.md to root, Linux and Android files to their respective directories
```

## Best Practices
1. Always check for existing files in the destination before moving
2. Create directory structure before moving files into it
3. Use proper quoting around paths with spaces
4. Use PowerShell-specific commands instead of Unix-style commands
5. Review git status carefully before committing
6. Write descriptive commit messages
7. Stage both new and deleted files when moving files

## Common Pitfalls
1. Forgetting to check for existing files in destination
2. Not handling spaces in file/directory names properly
3. Using Unix commands in PowerShell
4. Not staging both new and deleted files
5. Writing vague commit messages
6. Not creating directory structure before moving files
7. Not checking git status before committing 