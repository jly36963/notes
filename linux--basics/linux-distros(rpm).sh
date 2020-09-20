# ---------------
# RPM distros
# ---------------

# RPM
    # Red Hat and CentOS are both RPM based

# ------------
# yum (red hat & centOS)
# ------------

# yum (yellowdog updater modified)
    # yum cheatsheet
        # https://access.redhat.com/sites/default/files/attachments/rh_yum_cheatsheet_1214_jcs_print-1.pdf
    # automatically resolves dependencies during package installation
    # distros
        # redhat -- subscribers only. redhat subscription management service grants access to software repositories.
        # centos -- no subscription needed. use software running RHEL, Fedora, or CentOS

# info 
yum info package1
# install
yum update package1
# remove
yum update package1
# reinstall (replace deleted files)
yum reinstall package1
# check for updates
yum check-update
# update
yum update
# clean yum cache
yum clean packages
# search
yum search package1
# check for package
yum list installed | grep -i package1

# list installed & available package groups
yum grouplist
# install group
yum groupinstall "Web server"

# list enabled software repos
yum repolist
# install repo
yum install repo1

# history
yum history list # list history transactions
yum history info 3 # details about transaction 3
yum history undo 3 # undo transaction 3
yum history redo 3 # redo (undone) transaction 3

# rpm
    # use yum whenever possible (rpm doesn't care about dependencies)

# check installed packages
rpm -qa | grep -i package1 # rpm (auery) (all)
# get info about package
rpm -qi package1 # rpm (query) (info?)
# location
rpm -ql package1 # (query) (location)
# install
rpm -ivh package1.x86_64.rpm # rpm (install) (verbose) (hash)
# upgrade
rpm -Uvh package1
# remove
rpm -e package1 # rpm (erase)

# ---------------
# zypper (openSUSE)
# ---------------

# RPM
    # openSUSE is RPM based

# search
zypper search package1
# list and update packages
zypper list-updates
zypper update
# list and update packages (2)
zypper lu
zypper up
# list needed packages
zypper list-packages 
zypper lp
# apply patches
zypper patch 
# list patches
zypper patches
# patch check
zypper patch-check


# ---------------
# sosreport (redhat)
# ---------------

# sosreport collects config details, system info, and diagnostic info
    # running kernel version, loaded modules, system / service config files
    # common starting point for Red Hat support engineers

# install
yum install sos
# run
sosreport
# send report to Red Hat
yum install redhat-support-tool
redhat-support-tool addattachment -c CASE_NUMBER -f /path/to/sosreport





# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



# ---------------
#
# ---------------



