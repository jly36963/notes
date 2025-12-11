# linux system adminisration

## run level

- run level -- state of system
  - 0: shut down
  - 1: single mode
  - 2: multiuser (no networking)
  - 3: multiuser without X (wihtout command line)
  - 4: not used
  - 5: X11 (GUI)
  - 6: reboot system

- targets -- replaced run levels (RHEL 7, Ubuntu 16.04, etc.) (systemd replaced
  sysVinit)
  - 0: poweroff.target (shut down)
  - 1: rescue.target (single mode)
  - 2: * -- user-defined/site-specific run levels. default: identical to 3
  - 3: multi-user.target (multiuser, non-graphical, command line)
  - 4: * -- user-defined/site-specific run levels. default: identical to 3
  - 5: graphical.target (multiuser, graphical)
  - 6: reboot.target (reboot)

```sh
# current (default) target
systemctl get-default
# switch target
systemctl isolate multi-user.target # legacy run level 3
systemctl isolate graphical.target # legacy run level 5
# shutdown
systemctl halt # halt
systemctl poweroff # poweroff
systemctl reboot # reboot
```

## sudo

```sh
sudo <command> # super user do once
su # interactive shell as root (if no options/user provided as arg)
su user1 # switch user to user1

whoami # get current user
sudo whoami # get current user (root)
```

- change sudo permissions
  - /etc/sudoers
  - user1 All=(ALL) ALL
  - %group1 ALL=(ALL) ALL

## root password recovery

- reboot
- e to edit
  - edit grub file
- rw init=/sysroot/bin/bash
  - add right before it says crash kernel
- ctrl + x
  - triggers start
- chroot /sysroot
- passwd root
  - change password
- touch /.autorelabel
  - causes fs relabel on reboot
- exit
- reboot

## user / group administration

- linux supports 3 types of users --
  - root -- superuser with admin/full access. automatically created during linux
    installation.
  - normal -- user-level privileges. (no admin functions)
  - service -- take care of installed services. (examples: apache, ftp, mail,
    npt, postfix, qemu)

- user authentication files
  - these files are referenced to check/validate credentials during login
  - these files are updated when user account is created / modified / deleted.
  - backups of these files are also in the /etc directory (example:
    /etc/passwd-)
  - user auth files
    - /etc/passwd
      - important user login info. each line contains info for a user account
      - fields -- userName:pwPlaceholder:uid:gid:comments:homeDir:defaultShell
    - /etc/shadow
      - implementatin of shadow password mechanism provides secure password for
        local users
        - user existence checked (/etc/passwd) and password validated
          (/etc/shadow)
      - passwords are encrypted and stored in this file
      - only readable by root
      - fields --
        userName:encryptedPW:pwAging:minDays:maxDays:warnDays:inactiveDays:disabledDays:notUsed
        - ! -- locked password
    - /etc/group
      - group info. each line contains a group entry
      - fields -- groupName:psPlaceholder:gid:groupMembers
    - /etc/gshadow
      - shadow password implementation provides an added layer of security at
        the gorup level.
      - group passwords are encrypted and stored in this file.
      - only readable by root
      - fields -- groupName:encryptedPW:groupAdmins:members
        - ! -- disallows user access, !! -- ! and no group pw set

```sh
# add user
# by default, a group with the same name is created and used as primary group
useadd user1
# add user (comment) (currently used as name)
useradd -c "Kakashi Hatake" kakashi
# list users
getent passwd
cut -d: -f1 /etc/passwd
# info about user
id user1 # uid, gid, groups
# delete user
userdel -r user1
# modify user account
usermod -c "Kakashi Sensei" kakashi
usermod -g group1 kakashi # change primary group for user
usermod -G group1 kakashi # add supplementary group (additional groups)
# create user (nologin) (applications don't need login)
useradd -s /sbin/nologin user1 # create user (shell is set to nologin instead of bash)
grep user1 /etc/passwd # verify nologin

# create sudo user
useradd user1 # create user
passwd user1 # set password
usermod -aG wheel user1 # add to sudo group

# change password
# root can change anyone's
# user can only thange their own
sudo passwd user1 # opens dialogue for new password entry
# lock / unlock user account
passwd -l user1
passwd -u user1
# set password expiry immediately
passwd -e
# password aging
chage -l user1 # check password aging info for user
passwd -n 7 -x 28 -w 5 user1 # (minimum days between changes) (maximum days between changes) (warning days)

# add group
groupadd group1
groupadd -g 5000 group1 # specify group id
groupadd -o -g 5000 group1 # specify id, non-unique id
# change name
groupmod -n new_name old_name
# set password
gpasswd group1 # opens dialogue for new password
# set admin
gpasswd -A user1 group1
# list groups
groups
cat /etc/group # list groups
grep -i group1 /etc/group # find group
# delete group
groupdel sales
```

## password shadowing

TODO

## monitor users

```sh
# id
id user1 # uid, gid, groups
# who
who # display list of users who are currently logged in
# last
last # display list of last logged in users (and details)
# w
w # shows who is logged on (what they're doing) (siilar to who)
```

## permissions

### user/group permissions

```sh
useradd user1 # add user
chown user1 file.txt # change ownership to user
chgrp user1 file.txt # change group ownership to user
chown user2:user2 file.txt # change ownership and group ownership to user
chown user2:user2 . -R # recursively give ownership & group ownership to user
```

### file / dir permissions

- permissions
  - r -- read (4)
  - w -- write (2)
  - x -- execute (1)
- who to assign permissions to
  - u -- user owner
  - g -- group owner
  - o -- others
  - a -- all
- operators
  - `+` `-` `=`
- ls -l
  - user, group, others
  - example: rwxr--r--

```sh
# chmod
chmod file.txt u+r # give user read permission (one file)
chmod file.txt 777 # give all permissions (one file)
chmod 777 * -R # give all permissions (all files) (recursive -- includes child dirs)
chmod 777 . -R # give all permissions (all files) (recursive -- includes child dirs)
```

## understanding processes

- process -- unit for provisioning system resources (ie: programs, applications,
  commands)
- memory -- process is created in memory, in its own address space, when a
  program/app/command is initiated.
- hierarchy -- processes are organized in hierarchial fashion.
- relations -- each process has a parent, and potentially children. (many
  attributes are passed to child processes)
- PID -- each process has a PID (process identifier). this is used by the kernel
  to manage/control the process.
- completion -- when completed or terminated, a process reports to its parent.
  resources freed, PID removed.
- boot -- several processes are started at boot. Many sit in memory, waiting for
  events to trigger services.
- daemons -- the above mentioned background system processes are called daemons.
  (critical for system operation)
- process state
  - processes change their state multiple times during their lifecycles
  - processor load, memory availability, priority, response from other apps
    affect process state
- states
  - running -- being executed by the sytem CPU
  - sleeping -- waiting on input from a user/process
  - waiting -- ready, but waiting for its turn
  - stopped -- will not run until state is changed
  - zombie -- dead. exists until parent allows it to die. ("defunct process")
- simultaneous -- a system may have hundreds or thousands of processes running
  simultaneously on it.
- control signals -- these can be used to alert processes of events.
  - processes can send signals to alert each other.
  - a process will halt its execution as soon as it gets the signal.
  - a process will take action according to the enclosed instructions of the
    signal.
  - signals include: terminate (gracefully), kill, re-read configuration, etc
  - signals each have a unique numeric identifier, a name, and an action.
  - signals
    - SIGHUP -- hang up. can be used to instruct a daemon to re-read its config
    - SIGINT -- interrupt. (ctrl+C)
    - SIGKILL -- kill process abruptly
    - SIGTERM -- gracefully terminate

- ps -- show basic process info in 4 columns
  - PID (process id number) TTY (terminal) TIME (cumulative CPU time) CMD (name
    of program)
  - UID (user ID) PPID (parent process id number) C (processor utilization)
    STIME (start time) TIME (aggregated time)

```sh
# ps (list processes)
ps
ps -eafl # (every) (all) (full format) (long format)
# get PID
pidof bash
pgrep bash
ps -eaf | grep bash
# ps (user/group)
ps -U user1 # list all processes owned by user1
ps -G group1 # list all processes owned by group1

# htop
    # PID (process id) USER (owner of process) PR (priority) NI (nice value) VIRT (virtual memory)
    # RES (resident memory size) SHR (shared memory size) S (status) %CPU %MEM (cpu and mem used)
    # TIME (total cpu time) COMMAND (command/program)
htop

# list of control signals
kill -l
# kill process by name (root -- any, user -- owned)
pkill htop # soft kill
pkill -9 htop # hard kill
# kill process by PID
ps -eafl # get process ID
kill <PID> # soft kill
kill -9 <PID> # hard kill

# niceness -- inverse of priority.
    # controls execution time on CPU.
    # between -20 (l niceness, h priority) and +19 (h niceness, l priority).
    # default NI is 0
ps -eafl # process info (PRI -- priority)
htop # process info (NI -- niceness)
nice -10 process1 # # run process with custom NI
# renice
pidof top # get PID
renice -5 <pid> # renice PID
```

## system

```
# uname
uname -s # kernel name
uname -n # network mode hostname
uname -r # kernel release
uname -m # machine hardware name
uname -p # processor type
uname -i # hardware platform
uname -v # kernel version
uname -o # os
uname -a # all
```

- dmidecode
  - DMI -- desktop management interface: SMBIOS (system management BIOS)
  - tool for dumping a computer's DMI table of contents into a human-readable
    format
    - hardware, BIOS, serial numbers
    - doesn't work well in virtual machines
  - 0 (BIOS) 1 (system) 2 (baseboard) 3 (chassis) 4 (processor) 5 (memory
    controller)
  - 6 (memory module) 7 (cache) 8 (cache) 9 (system slots) 10 (on board devices)

```sh
dmidecode -t 0
```

```sh
arch # architecture
```

## ssh

```sh
# ssh
ssh user@ip # ip address
ssh user@hostname # host
ssh user@ip -p 22 # specify port 22

# ssh (with command)
ssh user@ip ls ~/
```

- ssh-keygen
  - creates a pair for public key authentication
  - interactive process
    - where to save file (typically saved in ~/.ssh/)
    - enter passphrase (used to encrypt key, should be strong)

```sh
ssh-keygen
# ssh-keygen (specify beforehand)
ssh-keygen -f ~/.ssh/new_key -t rsa -b 4096 # file, algorithm, bits

# ssh-copy-id
    # copy public key to server
ssh-copy-id -i ~/.ssh/new_key user@ip

# ssh-agent
    # holds private key (private key passphrase only supplied once)
eval `ssh-agent`
ssh-add ~/.ssh/new_key
```

- scp
  - copy files between computers
  - specify port with `-P 22`
  - change cipher with `-c blowfish`

```sh
scp ~/app/file.txt user@ip:~/app/file.txt # copy from local to remote
scp user@ip:~/app/file.txt ~/app/file.txt # copy from remote to local
```

## motd / wall

```sh
# motd -- sends a message when a user logs in
cat /etc/motd

# wall -- send a message to logged in users in real time
wall # press enter. type message. ctrl+D
wall file.txt
echo "message" | wall
wall <<< "tmessage"
```
