---
dg-publish: true
dg-path: Linux/disable predictable naming schemes
permalink: /linux/disable-predictable-naming-schemes/
noteIcon: ""
created: 2025-03-17T16:52:16.110-04:00
updated: 2025-03-20T01:09:01.851-04:00
hide: true
---

There are 3 methods to do so:
## Disable assignment of fixed names
```bash
ln -s /dev/null /etc/systemd/network/99-default.link
```

## Create your own manual naming scheme
you can name your interfaces manually (like `internet0, ``lan0`, etc). Create your own  [.link](`https://www.freedesktop.org/software/systemd/man/systemd.link.html) files in `/etc/systemd/network` and choose explicit names for your interfaces or create a whole new naming scheme.

.link files encode configuration for matching network devices. Configuration files are sorted and processed in alphanumeric order. 
>Note: It is best practice to prefix filenames with a number ie `10-eth0.link`

## Pass net.ifnames=0 on the kernel command line
