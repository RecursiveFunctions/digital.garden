---
dg-publish: true
permalink: /linux/scp/
noteIcon: ""
created: 2025-03-17T16:52:16.167-04:00
updated: 2025-03-20T01:48:40.753-04:00
tags:
  - linux
hide: true
---

The syntax for **scp** is very similar to the _cp_ command, except the location of the file will contain _User_@_host_:_remote-file-path_
```bash
scp <user>@<ip>:<filepath> <destination filepath>
#or to upload
scp <source file path> <user>@<ip>:<destination path>
#to upload a remote file to a remote destination
scp <user1@hostA>:<source file path> <user2@hostB>:<destination path>
```
![Pasted image 20221111013910.png](/src/site/img/Pasted%20image%2020221111013910.png)
![Pasted image 20221111014337.png](/src/site/img/Pasted%20image%2020221111014337.png)
