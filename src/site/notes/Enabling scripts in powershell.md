---
dg-publish: true
permalink: /windows/enabling-scripts-in-powershell/
hide: true
---


```powershell
get-executionpolicy
```
if it says restricted, enter the following:
```powershell
set-executionpolicy remotesigned
```

if you want to run unsigned scripts
```bash
set-executionpolicy unrestriced
```
