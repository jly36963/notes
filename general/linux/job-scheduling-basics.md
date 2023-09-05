# Job Scheduling

- Access
  - by default, all users have access to crond and atd
  - configure access (crond) -- cron.allow & cron.deny files.
    - default -- deny files exist, allow files don't. This means users have full
      access.
    - cron.allow -- if this file exists, only users listed here have access.
    - cron.deny -- if no 'cron.allow' file, all users except those listed here
      have access.
  - configure access (atd) -- at.allow & at.deny files.

- logging
  - scheduler log file -- logs all activities involving crond/atd
  - /var/log/cron
  - time of activity, hostname, owner, PID, message

## atd

- atd -- schedule one-time jobs
  - submitted jobs are spooled in /var/spool/at
  - executed by atd daemon at specified time

```bash
# install
yum install at
# service (NOT TESTED)
service atd start # start
service atd restart # restart
service atd stop # stop
# systemctl (NOT TESTED)
systemctl start at.service
systemctl restart at.service
systemctl stop at.service
# times
at 1:20am # 1:20 am (12 hr clock)
at noon # 12 pm
at 12:42 # 12:42 pm (24 hr clock)
at midnight # 12am
at 17:01 tomorrow # 5:01 the next day
at now + 7 hours # 7 hours from now
at 3:00 6/4/20 # time and date
# command
at 11:06 <<JOB
    echo "Starting"
    touch /mnt/c/Users/jly36/Desktop/hello.txt
    echo "Complete"
JOB
# file
at -f ~/myscript.sh now + 3 hours
```

## submit, view, list job

TODO

## CRON (daemon)

- cron -- system utility which can schedule command/script to run automatically
  at a specified time/date
  - cron job -- scheduled task itself.
  - crontab -- cron utility runs based on commands specified in cron table
    (crontab)

- anacron -- program that runs cron jobs, including missed ones.
  - kind of complicated
  - missed jobs will only get run once (even if multiple cycles were missed)
  - after boot, anacron checks for missed jobs. Each missed job is run once.

```bash
# service (RPM)
service crond start # start
service crond restart # restart
service crond stop # stop
# service (debian)
service cron start # start
service cron restart # restart
service cron stop # stop
# systemctl (centos7)
systemctl start cron.service
systemctl restart cron.service
systemctl stop cron.service
```

```bash
crontab -e # add cron job
crontab -l # list contents of cron table
crontab -r # remove cronjob
```

frequently used schedules:

- `0 0 1 1 *` every year
- `0 0 1 * *` every month
- `0 0 * * 0` every week
- `0 0 * * *` every day (midnight)
- `0 * * * *` every hour

```bash
# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  *  command
```

## Cron example

```bash
# crontab -e
SHELL=/bin/bash
MAILTO=root@example.com
PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin

# run every tuesday at 7am
# 0 7 * * 2 ls
# 0 7 * * 2 /home/jly36963/tuesday.sh

# backup using the rsbu program to the internal 4TB HDD and then 4TB external
# 01 01 * * * /usr/local/bin/rsbu -vbd1 ; /usr/local/bin/rsbu -vbd2

# Set the hardware clock to keep it in sync with the more accurate system clock
# 03 05 * * * /sbin/hwclock --systohc

# Run script every thursday at 3pm
# 00 15 * * Thu /usr/local/bin/mycronjob.sh

# Make report every quarter
# 02 03 1 1,4,7,10 * /usr/local/bin/reports.sh

# Run every hour between 9:01 AM and 5:01 PM
# 01 09-17 * * * /usr/local/bin/hourlyreminder.sh
```
