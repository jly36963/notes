# FS

## Move/Copy/Remove

Move

```bash
# mv (file)
mv -i file1.txt file2.txt # rename (confirm before overwrite)
mv file1.txt dir1/ # move file to child directory
mv file1.txt dir1/file2.txt # move and rename
# mv (dir)
mv dir2 dir3 # rename (dir3 DNE)
mv dir2 dir1 # move dir2 into dir1 (dir1 exists)
mv dir2 dir1/dir2 # move dir2 into dir1 (dir1 exists)
mv dir2 dir1/dir3 # move and rename (dir3 DNE)
mv dir2 dir1/dir3/ # move and rename (dir3 DNE)
```

Copy

```bash
# cp
cp -i file.txt file2.txt # copy file (confirm before overwrite)
cp -r dir1 dir2 # copy dir (recursive)
```

Remove

```bash
# rm
rm -i file.txt # remove file (asks for confirmation (usually the default behavior))
rm -f file.txt # remove file (force)
rm -rf dir1 # remove directory (recursive) (force)
```

## Locate

works on files.\
uses mlocate db.

```bash
locate *.txt # find all files ending in '.txt'
locate -i *.txt # case insensitive
locate -i -l 10 *.txt # case insensitive, limit results to 10
locate -S # data about mlocate db (the locate program's db)
locate -e *.txt # check existance (db might not be current)
```

## Find

works on files/dirs.\
operates directly on OS.\
find is recursive by default

```bash
# print (default)
find ./ -name file.txt # find file in directory
find ./ -name *.txt # find (wildcard)
find ./ -size +10M # find (size) (greater than 10MB)
# delete
find ./ -name file.txt -delete

# find
# works on selected dir and it's descendent dirs/files
find # find all files/dirs/subdirs in current dir
find ~/Desktop/ # find in desktop
find . -maxdepth 1 # find in current dir
find . -maxdepth 3 # current, child, grandchild dirs
find . -type f # find files
find . -type d # find dirs
find . -name "*.txt" # files/dirs matching '*.txt'
find . -iname "*.txt" # files/dirs matching '*.txt' (case insensitive)
find . -type f -size +100k # find files >100KB
find . -type f -size +10M # find files >10MB

# needle in haystack (find and move to desktop)
mkdir haystack
mkdir haystack/folder{1..500}
touch haystack/folder{1..500}/file{1.100}
find haystack -type f "needle.txt" -exec mv {} ~/Desktop \;
```

## Get all files

```bash
# copy all files from current directory to '~/Desktop/dir1'
find . -maxdepth 1 -type f -exec cp {} ~/Desktop/dir1 \;
# same, but ask permission for each
find . -maxdepth 1 -type f -ok cp {} ~/Desktop/dir1 \;
```

## Partitioning & fs

- data is stored on disk drives that are logically divided into partitions
  - partition --
  - file system --

- boot
  - partition info is stored on the disk in a small region called the MBR or
    GPT.
  - this info is used by the OS at boot time
    - BIOS/UEFI scans disks for MBR/GPT
    - identifies boot disk
    - loads boot loader in memory
    - reads partitino table and looks for '/boot' partition.

- MBR (master boot record) for BIOS systems
  - resident on the first sector of the boot disk.
  - limited to addressing space of 2TB (due to 32-bit nature and 512-byte sector
    size)
  - non-redundant -- records can't be replicated.
  - can only create four primary partitions on a single disk
    - one of the four can be an extended partition and hold an arbitrary number
      of logical partitions.
  - limitations of MBR led to the development of GPT
- GPT (GUID partition table) for UEFI systems
  - increasing number of >2TB disks on x86 computers, a new 64-bit partitioning
    standard was made.
  - GPT -- new partitioning standard. integrated into UEFI firmware.
  - allowed for the following:
    - 128 partitions, disks much greater than 2TB, UEFI firmware, 4KB sector,
      redundancy of data

- tools
  - parted
    - understands both MBR and GPT
  - gdisk
    - designed to support GPT format only
  - fdisk
    - MBR only (doesn't understand GPT), cannot address space exceeding 2TB
  - LVM -- logical volume manager
    - widely used for managing disk storage

- LVM
  - provides an abstraction layer between the fs and the physical storage
  - allows for resizing
  - enables fs to span multiple physical disks
  - can use random disk space
  - move from one disk to another without taking the fs offline
  - before LVM, running out of disk space usually meant:
    - installing new hard drive
    - booting to recovery / single-user mode
    - creating a partition and a fs on the new hard drive
    - using temporary mount oints to move the data from the fs to a larger one
    - changing the content of the /etc/fstab file to reflect the new partition
    - rebooting to remount the new fs on the correct mount point.
  - LVM allows for
    - the ability to add disk space to a logical volume and its fs while
      mounted/active
    - collection of multiple physical hard drives / partitions into a single
      volume group
    - reduction of a logical volume
    - mirroring of the logical volume
    - moving from one storage disk without taking the system offline

- structure
  - physical hard drive -> physical volume -> volume group -> logical volume ->
    fs

## Parted

- parted -- managing storage
  - view, add, check, modify, copy, resize, delete partitions
  - understands MBR and GPT schemes

- create MBR or GPT partition table and a partition

```bash
# create MBR table and partition
lsblk # see the disk
parted /dev/sdb # start parted program 
help # view list of commands (in parted program)
print # info on chosen partition (in parted program)
mklabel msdos # create MBR partition (in parted program)
mkpart primary 1 100M # make command, type, number system, size (in parted program)
quit # quit (in parted program)

# delete MBR partition
parted /dev/sdb 
print 
rm l # remove partition with specified system number

# command for creating GPT partition
mklabel gpt # create GPT partition (in parted program)

# comfirm 
parted /dev/sdb print
grep sdb /proc/partitions
```

## Creating PVs, VGs, LVs

- adding a new LV -- https://opensource.com/business/16/9/linux-users-guide-lvm
  - new hard drive
  - create partition on HD
  - create PV
  - assign PV to a VG (or create VG)
  - create LV from space in the VG
  - create fs on new LV
  - add appropriate entries to /etc/fstab for mounting the fs
  - mount fs

```bash
# physical volume (PV)
lsblk # check disks
pvcreate /dev/sdb # create a PV
pvs; pvdisplay # confirm 

# volume group (VG)
vgs # check existing volume groups
vgcreate vg1 /dev/sdb # create volume group (command, name, physical volume)
vgs; vgsdisplay # check

# logical volume (LV)
lvcreate -n lv1 -L 50M vg1 # create LV (name, size, which vg)

# create fs
mkfs -t ext4 /dev/vg1/lv1 # create ext3 fs 
blkid # get uuid (name of LV)
e2label /dev/vg1/lv1 lv1 # add fs label

# mount fs
mount # check which volumes are mounted
mkdir /mnt/new_mnt # make sure mount point exists
mount /dev/vg1/lv1 /mnt/new_mnt # mount volume
df -h # check fs and mount point. These will be used later

# make mount permanent
    # use fs and mount point from `df -h`
    # in /etc/fstab, add the following line:
/dev/vg1/lv1 /mnt/new_mnt ext4 defaults 0 2 # (fs) (mount point) (type) (options) (dump) (pass)

# unmount
umount /mnt/new_mnt # use mnt point or device file (/dev/vg1/lv1)
```

## Extend VG and LV

```bash
# extend VG
lsblk # check for available disk ('sdc' in example)
pvcreate /dev/sdc # create physical volume
vgextend vg1 dev/sdc # extend volume group (args: volume group, PV to extend with)
vgs # check

# extend LV
lvs # check LVs (use VG and LV in extend command)
vgs # check VGs (use VFree in extend command)
lvextend -L 100M /dev/vg1/lv1 # (args: new size, LV) (alternative, size to add: `-L +20M`) (GB -- `-L +1G`)
df -h # check fs (nothing should have changed yet)
resize2fs /dev/vg1/lv1 # resize
df -h # check fs (fs should be extended now)

# mirrored LV
pvcreate /dev/sdd /dev/sdc # create PVs
pvs # check PVs
vgcreate vg1 /dev/sdd /dev/sdc # create VG using PGs
vgs # check VGs
lvcreate -m 1 -L 10M -n lv1 # create mirrored LV (args: mirrors, size, name)
lvs -a # check LVs (should be a RAID 1, there will be metadata volumes)
mkfs -t ext4 /dev/vg1/lv1 # make fs (args: type, LV)
mkdir /mnt/new_mnt # create directory for mount
mount /dev/vg1/lv1 /mnt/new_mnt # mount
df -h # check fs

# move volume from one storage to another
    # example: sdc -> sdd
pvs # check PVs
lsblk # check disks
pvcreate /dev/sdd # create PV
vgextend vg1 /dev/sdd # extend VG (args: VG to extend, PV to extend with)
pvmove /dev/sdc /dev/sdd # move PV (sdc -> sdd)
pvs; pvdisplay; lsblk # check PVs and disks
vgreduce vg1 /dev/sdc # remove old PV from VG (args: VG, PV)
pvremove /dev/sdc # remove PV (args: PV)

# remove LV
lsblk # check mount point
umount /mnt/new_mnt # unmount LV
lvs # check LV to remove (and get its associated VG)
lvremove -f /dev/vg1/lv1 # remove LV (force)
# remove VG
vgs # check VGs
vgremove vg1 # remove VG
# remove PV
pvs # check PVs
pvremove /dev/sdd # remove PV
lsblk # check disks
```

## Curl

```bash
curl url # make get request (standard out)
curl -I url # get headers
curl -I --http2 -s url | grep HTTP # check if website supports http/2
curl -L url # make get request, follow redirects
curl -O url # download (assumes fn)
curl -o fn url # download (specify fn)
```

## Archive / Compression

- compression
- use tar -z if you want to archive/compress multiple files together

```bash
gzip file.txt
gunzip file.txt.gz
bzip2 file.txt
bunzip2 file.txt.bz2

# tar (archive)
tar -zcvf archive1.tar.gz dir1/ # archive/compress (gzip) (create archive) (verbose) (specify filename)
tar -zxvf archive.tar.gz # extract (gzip) (extract) (verbose) (specify filename)

# make backup (of "dir")
tar -cvzf "dir-$(date +%m-%d-%y).tar.gz" "./dir"
```

## Links

- Soft or hard
- use hard link whenever possible

- inode (index node) -- kernels recognize filenames as a numeric identifier
  (inode)
- link -- pointer to another file
  - symbolic link (soft)
    - similar to shortcut in windows
    - unique inodes
    - can span multiple fs
  - hard link
    - associates one or more files with a sigle inode number (same inode)
    - changing a file will affect hard-liked files
    - deleting, renaming, moving the original file will not affect hard link
    - only valid within the same fs

```bash
ll -i file1.txt # get inode
ln -s file1 file2 # create soft link
ln file1 file2 # create hard link
```
