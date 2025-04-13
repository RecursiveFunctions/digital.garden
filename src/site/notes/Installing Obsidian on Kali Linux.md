---
dg-publish: true
permalink: /linux/installing-obsidian-on-kali-linux/
noteIcon: 
created: 2025-03-20T01:32:27.995-04:00
updated: 2025-03-20T02:12:13.684-04:00
tags:
  - linux
hide: true
---

##### Download the [AppImage](https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian-1.0.3.AppImage) [(Archived)](https://web.archive.org/web/20250314/https://github.com/obsidianmd/obsidian-releases/releases/download/v1.0.3/Obsidian-1.0.3.AppImage)  for Obsidian


```bash
#modify the permissions
sudo chmod u+x Obsidian-1.0.3.AppImage
```

##### run [[src/site/notes/Obsidian\|Obsidian]]
optional: add "`&`" at the end to run it in the background and free up your terminal
```bash
./Obsidian-1.0.3.AppImage &
```