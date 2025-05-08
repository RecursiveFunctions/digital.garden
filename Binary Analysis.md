# ELF Format
* ELF header
* header table
* .text
* .rodata
* .data
* section header table

## Viewing symbols (functions)
```bash
$> objdump -TC $filename
```

## View sections
```bash
$> objdump -x $filename
```

# PE
[Official Docs](https://docs.microsoft.com/en-us/windows/win32/debug/pe-format)
* MS-DOS MZ HEADER
	* e_1fanew
* MS-DOS REAL-MODE STUB PROGRAM
* PE FILE SIGNATURE PE\0\0
* PE FILE HEADER
* PE OPTIONAL HEADER
* SECTION HEADERS
	* .rsrc section header
* SECTIONS
	* .rsrcsection

* can be view in objdump

# Striped Binaries
* removes the symbol names from the binaries.
* makes debugging harder.
* makes binaries smaller
```bash
$> strip
```

# Readelf
Can be used to read dynamic library dependencies
```bash
readelf -d <filename>
```

# Common binary locations
malware will commonly drop to specific locations because of elevated permissions in those directories (eg being world writable)
###### Windows
```cmd

C:\User\$USERNAME\AppData\local
C:\User\$USERNAME\AppData\Roaming
C:\User\Public
C:\Windows\temp
```

###### Linux 
```
/var/tmp/
/tmp/
/var
/var/www
/var/www/html
```

#### Android
###### v3-4
```
/sdcard
/dev
```
####### v5-7
`/dev`
######  v8
`/`
* mount -o rw
* remount /

###### v9
`/sbin`
* mount -o rw, remount /
* mimicking the filename of a valid app in that dir

###### v10+
* cannot remount `/` to execute anything as root
* You have to load extra functionality as shared objects

##### Android Protections
###### Android 3-4.0
* No pie
###### Android 4.0.1-4.4.4
* With or without pie
* DM Verity
* SELinux permissive
###### Android 5
* Pie only
* SEELinux Enforcing
###### Android 7.1
* DEFEX (root exec only in /)
###### Android 9
* DEFEX (root exec only for whitelisted binaries)
###### Android 10+
* You can't remount / to execute anything as root
* You have to load extra functionality as shared objects

## Binary Triage
You can use linux tools to carve metadata information and suspicious artifacts from binary files
* Strings
* Binwalk
* Hexdump