# Linux basics

## Linux OS components

- os -- manages communication between software and hardware
- bootloader -- process that manages boot
- kernel -- core of OS. controls CPU, memory, and peripherals
- daemon -- background system service
- shell -- user interface for accessing OS services (CLI or GUI)
- server -- 'command-line server' (server) or 'graphical server' (desktop)
- application -- leverages OS to carry out user executed operations.

## Popular distributions

- RPM based
  - Red Hat (RHEL)
  - CentOS
  - SUSE
  - Fedora
- Debian Based
  - Ubuntu
  - Kali

## Linux directory structure

- FHS -- linux follows a file system hierarchy standard

- / -- root
- /boot -- boot config files (used by boot loader). linux kernel. boot support
  files. boot config files (ie: grub.cfg)
- /root -- default home directory for the root user
- /dev -- info about devices. (drives, keyboard, mouse, printer, etc)
- /etc -- system config files (DNS, NTP)
- /bin (/usr/bin) -- binary/executable files, user commands (ie: ls)
- /sbin (/usr/sbin) -- system/filesystem related commands (ie: mkfs)
- /opt -- additional (3rd party) software
- /proc -- runs processes that only exist in memory.
  - maintains info about current state of CPU, kernel, memory, disks,
    partitions, file systems, running processes
  - automatically managed by system. contents are created at boot time, updated
    during runtime, lost at shutdown/reboot
- /lib (/usr/lib) -- library routines for many commands
- /tmp -- temporary files. (files deleted at reboot)
- /home -- user home directories
- /var -- dynamic data. where the system writes data during its operation. logs,
  error logs, etc.
- /run -- tmpfs. mounted during early boot process. stores volatile runtime
  data.
- /mnt -- mount external or temporary fs
- /media -- mount removable media (usb, cd, dvd, floppy etc)
- /srv -- holds to-be-served data for protocols such as ftp, rsync, www
- /usr/local -- where system administrator installs software locally. (separate
  from OS, safe from OS updates.)

## Shell

- shell -- interface between user and kernel
  - linux supports many shells (bash, csh, ksh, zsh)
  - bash is the most popular linux shell
    - location -- /bin/bash
  - `$` -- regular user
  - `#` -- root user

### List shells

```zsh
cat /etc/shells
```

### Change shell

```zsh
bash
sh
dash
tmux
rbash # bash with many features restricted
zsh # not native to ubuntu -- requires `sudo apt install zsh`
```

### The terminal

- submits command in terminal --> shell interprets --> code is executed

- each command starts with the command name, then options/operands.
- $PATH is a list of directories that the shell looks in for commands.

## Navigation

```zsh
# change directory
cd . # current dir
cd .. # parent dir
cd /etc # absolute path
cd ./dir1 # absolute path (./ -- current dir)
cd dir1/ # relative path
cd ~ # home dir (`cd` with no args will do this)
cd - # previous directory
```

## Basic commands

```zsh
# cd -- change directory
cd dir1/ # relative path
cd /etc/ # absolute path
cd ./dir1/ # absolute path
# ls -- list directory contents
ls # list filenames
ls -lah # ls (with details) (include hidden) (human readable)
ls ./dir1/ # ls (with path)
# mkdir -- make directory
mkdir dir1
# touch -- make file
touch file.txt
# which -- where is the program located
which python
# whatis -- short description
whatis python
# info -- get info (man pages?)
info python 
# pwd -- print working directory
pwd
# clear -- clear output
clear 
# exit -- exit shell or current session
exit
# date
date # today's date, timezone, year
cal # calendar for the current month
```

## History

```zsh
history | tail # last 10 commands
!1 # run first command in history (!9 -- ninth command)
!! # run most recent command again (also, up arrow to see prev commands)
!$ # last argument of preceding command
$_ # last argument of the previously executed command
history -c # clear bash history
cat /dev/null > ~/.bash_history && history -c && exit # clear history well
```

## Man

```zsh
# man -- man pages
man <program> # open manual for program

# syntax in manual pages
[optional] # optional
<mandatory> # mandatory
[a | b] # one or the other
... # can take more than one (of the preceding term)
```

## Echo

```zsh
echo "Hello there!"
echo "$SHELL"
echo "$PATH"
```

## Variables

```zsh
# env
# USER, PWD, HOME, SHELL, PATH
env # list environment variables (also `printenv`)
NAME="Kakashi"

# set env variable
    # can be passed from shell to sub-shell (parent to child)
NAME="KAKASHI"
export NAME
env | grep NAME

# variables
name="Kakashi"
echo "Hello there, $name!"
echo "Hello there, ${name}!"

# unset
unset name 

# store output in variable
a=$(date)  

# assign (older notes)
var1="hello world!" # assign value to variable
echo $var1 # print variable value

${var1="Hello world!"} # assign & return value
${#var1} # string length of variable
```

## In, out, pipe, tee

- command pipelines (i/o)
  - commands receive:
    - standard input (0)
    - command arguments (not a data stream)
  - commands output
    - standard output (1)
    - standard error (2)

```zsh
# in / out / err
cat < file.txt # input redirection
cat file.txt > file2.txt # output redirected from standard out to file (overwrite)
cat file.txt >> file2.txt # output redirected from standard out to file (append)
cat file.txt >> file2.txt 2> error2.txt # stdout and stderr to file
cat file.txt >> file2.txt 2>&1 # sterr to stdout, stdout to file (no space allowed)
# pipe
lspci | grep -i nvidia # output (program 1) piped into input (program 2)
# tee
cat file.txt | tee file2.txt # tee output to stdout and file
# process redirection
a=$(date); b=$(date --date='5 minutes ago')
diff <(echo $a) <(echo $b)
```

## XARGS (convert piped data into command line arguments)

```zsh
# echo only accepts command line arguments
date | xargs echo # Thu 13 Dec 16:04:23 MST 2018
date | xargs echo "date: " # date: Thu 13 Dec 16:04:23 MST 2018
date | cut -d " " -f 1,2,3,6 | xargs echo # Thu Dec 13 2018
```

## Read / manipulate text contents

```zsh
# cat -- display contents of file
cat file.txt # read file
# more / less
more file.txt # lines of file (loads full file)
less file.txt # contents of file (doesn't load full file at once. faster than more)
# head / tail
head file.txt # first 10 lines
head -5 file.txt # first 5 lines
tail file.txt # last 10 lines
tail -f file.txt # last 10 lines (live updating)
# count
wc file.txt # lines, words, characters
wc -l file.txt # -l (lines) -w (word) -c (bytes) -m (character)
```

## Grep

- `*` wildcard
  - wildcards work with most bash programs

```zsh
# grep search plain-text data for lines that match a regular expression
grep a # includes a
grep -v a # doesn't include a
grep -i a # case insensitive
grep -n a # includes a (return line number as well)
grep -e a # expression 
grep -w a # whole word 
grep ^a # starts with a

# sort 
sort words.txt # sort alphabetical
sort words.txt -r # sort reverse-alphabetical
sort nums.txt # sort numbers by digit (11, 110, 23, 250)
sort nums.txt -n # sort numbers by value (11, 23, 110, 250)
sort words.txt -u # sort alphabetical, unique (no duplicates)

# sort (tabular data)
ls -l | sort -k 5 # sort table by 5th column (key)
ls -l | sort -k 5rn # sort table by the 5th column (numerically, reversed)
ls -lh | sort -k 5hr # human readable (sort correctly)

# tr -- translate / delete characters from a file
cat file.txt | tr a-z A-Z # lower to upper
# sort
getent passwd | sort -f
# diff (files)
diff file1 file2 
# diff (variables)
a=$(date); b=$(date --date='5 minutes ago')
diff <(echo $a) <(echo $b)
diff <(echo $a) <(echo $b) --side-by-side
# uniq
uniq <(getent passwd) # shows unique
uniq <(getent passwd) --repeated # shows repeated lines
# cut
tail /etc/passwd | cut -d: -f 1 # first column only
```

# regex

- `[aeiou]` # matches any one of a set
- `[a-z]` # matches any one of range
- `^a` # must begin with following character
- `[^a]` # pattern must not contain character
- `a$` # must end with preceding pattern
- `.` # matches any one character
- `a*` # matces gte 0 occurences of the preceding pattern
- `a+` # matches gte 1 occurences of preceding pattern
- `a?` # 0 or 1 times
- `a{3}` # matches preceding pattern n times
- `a{3,}` # gte 3 times
- `a{3 5}` # n - m times
- `a{,5}` # lte m times
- `^#|^$` # only empty lines and comment lines (use with `grep -Ev`)
- `\` # escape metacharacter

# egrep (regex)

- extended global regular expression print
- egrep = 'grep -E'
- egrep is closest to perl/js regex)

```zsh
# searches for lines in file1.txt that match the pattern
egrep '^[:alpha:]*$' file1.txt
```

- `.` any single character
- `?` preceding char 0 or 1 times
- `*` preceding char 0 or more times
- `+` preceding char 1 or more times
- `{n}` preceding char exactly 'n' times
- `{n,m}` preceding char 'n' to 'm' times (inclusive of endpoints)
- `{n,}` preceding char 'n' or more times.
- `{,m}` preceding char 'm' or less times.
- `[abc]` matches any character listed ('a', 'b', or 'c')
- `[^abc]` matches any character NOT listed (not 'a', 'b', or 'c')
- `[a-c]` matches characters between (a,b,c)
- `[A-Za-z0-9]` matches all alphanumeric chars
- `()` | - logical or
  - (the|a|an) # matches 'the', 'a', or 'an'
- ^abc$` ^ and $ (begins with, ends with)

Predefined expressions:

- `[:alnum:]` alphanumeric
- `[:alpha:]` letter
- `[:blank:]` space, tab
- `[:cntrl:]` control characters (ascii 0-37, 177)
- `[:digit:]` 0-9
- `[:graph:]` graphical characters (:alnum: & :punct:)
- `[:lower:]` a-z
- `[:print:]` printable characters (:alnum:, :punct:, and space)
- `[:punct:]` ascii punctuation characters
- `[:space:]` tab, newline, vertical tab, form feed, carriage return, space
- `[:upper:]` A-Z
- `[:xdigit:]` 0-f (hexadecimal)

# Aliases

```zsh
# create '.bash_aliases' file in home
alias getdate = 'date | tee /home/jly36963/Desktop/date.txt  | cut -d " " -f 1,2,3,6'
# in terminal:
getdate

# alias building block (prepared for standard in and out)
alias calender3 = 'xargs cal -A 1 -B 1'
# in terminal:
date | cut -d " " -f 2,6 | calendar3 | tee cal3.txt
```

# Utilize .bash_aliases (some distros won't use .bash_aliases by default)

If `~/.bash_aliases` file, put this in `.bashrc`, `zshrc`, etc

```zsh
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
```
