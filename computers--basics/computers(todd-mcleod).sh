# ------------
# computers
# ------------

# purpose of computers
    # IPOS -- input, process, output, store

# software
    # system -- OS, utlities, drivers, translators (to machine code)
    # application

# generations of computers (machine code) (store on/off states)
    # vacuum tubes -- hot, attracted bugs, burned out quickly
    # transistors
    # integrated circuits (silicon wafer chip)
    # cpu

# ------------
# network
# ------------

# network -- 2 or more connected devices
# internet -- largest network. originally ARPANET. infrastructure supporting WWW.
# IP address -- internet protocal address
# URL -- uniform resource locator. domain name.

# ------------
# email
# ------------

# to -- recipient of email
# cc -- recipient of copy
# bcc -- recipient of blind copy
    # 'to' and 'cc' will not know about the 'bcc'
    # 'bcc' will know about 'to' and 'cc', but not other 'bcc'.

# ------------
# coding schemes
# ------------

# text
    # coding schemes -- ascii, ebcidic, unicode
# images
    # bit depth (how many colors can be used)
    # ie: 1 bit, 2 color options. 8 bit, 256 options. 24 bit, true color
# audio
    # sampling rate (how many samples per second)
    # ie: 44100 Hz
    # bit depth (how many options)
# video
    # 

# ------------
# hardware
# ------------

# system unit -- case
# motherboard -- main (green) circuit board. connects everything
# bus -- wires that allow data to move from location to location
    # sata -- connect drives to motherboard. (serial advance technology attachment)
    # usb -- universal serial bus
# power supply -- provides power to hardware. has a fan.
# RAM -- random access memory
    # where currently-used data is stored.
# CPU
    # ALU (arithmetic logic unit) -- performs arithmetic and logical operations
    # control unit -- extracts instructions from memory, decodes/executes them. calls on ALU.
    # registers -- storage. supply operands to ALU and store results of operations.
    # cache (l1, l2, l3) -- storage. smaller, faster, closer to processor core than RAM.
    # I/O unit -- interface between CPU and I/O devices.
# CPU cores
    # dual core, quad core, 8 core, etc.
    # physical cores -- # of cores
    # logical cores --  # of cores * allowable threads (hyperthreading)
# system clock -- sets clock rate (operations/second) (ie: 3.4 GHz)
# heat sink -- sits between CPU and fan. increases surface area, helps cooling.
# fan -- cool system parts.
# drive bays -- slots for hard drives
# storage drives -- storage. require power and sata connection to motherboard.
    # hdd -- read/write head. more prone to failure. slower
    # ssd -- no moving parts. faster.
# optical drives
    # cd, dvd, bluray drives
# ports -- for usb, memory cards, microphone, headset, ethernet, hdmi, displayport, vga
# expansion slots -- place for expansion cards to plug in.
# expansion card -- connects to expansion slot. has ports exposed to the back of the computer.
    # video, sound, advanced graphics, ethernet, memory
# ethernet cable
# monitor connector -- vga, dvi, hdmi, displayport, mini-displayport

# ------------
# storage
# ------------

# storage (fastest to slowest)
    # CPU registers and cache -- working area
    # RAM -- primary storage (volatile)
    # ROM -- read only memory
        # BIOS -- basic input/output system
        # similar or slower speed than RAM.
        # really only used during boot
    # drives -- secondary storage (non-volatile)
        # solid state -- SSD
        # magnetic -- HDD, tape
        # optical -- cd, dvd, bluray

# ------------
# boot / bios
# ------------

# ROM -- component that contains BIOS
    # now EEPROM
    # originally built onto motherboard. permanent/unchanging

# BIOS
    # set BIOS password
    # change boot order -- computer boots from ROM, then looks through list of devices for OS to use.
    # enable/disable boot options
    # change clock rate
    # allow virtualization

# ------------
# instruction cycle (machine cycle)
# ------------

# fetch - decode - execute - store ---- repeat

# ------------
# speed factors
# ------------

# speed up computer: 
    # upgrade RAM, replace HDD with SSD
    # upgrade video card
    # remove unused programs
    # disk cleanup
    # defrag

# clock speed (ie: 3.4 GHz)
# number of processors/threads (physical/logical cores) (ie: 4 physical, 8 logical cores)
# GPU (graphics card) (expansion card in expansion slot)
# cache
# bus speed
# ssd > hdd
# word size (32 or 64 bit OS)

# ------------
# power consistency
# ------------

# surge protector
    # protect computer against random spikes of power
# UPS (uninterruptible power supply)
    # protects against spikes, brownouts (dip in power), and blackouts (power outage)

# ------------
# storage
# ------------

# device -- what does the read/write
# medium -- what holds the data

# storage access
    # direct access -- can access any data on disk
    # sequential access -- must access data in order

# storage technologies
    # tape
        # magnetic storage
        # sequential access
    # hdd
        # read/write head
            # moving computer while running can cause head crash
        # magnetic storage
        # disks (platters) that can be written both top and bottom
        # requires power connector (to power supply) and sata connector (to motherboard)
    # ssd
        #

# hdd
    # file representation 
        # logical file representation -- sum of space between platters
        # physical file representation -- multiple physical platters
    # disks
        # sector -- disk is divided into pie shaped sectors
        # tracks -- circular tracks where data is stored (magnetically)
        # cluster -- part of a track that spans two or more sectors. Smallest addressable unit of disk storage.

# optical
    # disks
        # track -- single, continuous, grooved track that spirals outward. holds recorded data (light)
        # sector -- track is divided into sectors for data organization.
        # pits -- when data is written to disc, a laser beam creates dark, non-reflective areas on the disk
    # reading
        # low intensity laser beam reads the disc. 
        # transitions between pits/lands represent 1s, space between transitions are 0s.
        # pits/lands don't represent 0s and 1s, the transitions and space between transitions do.

# ssd (flash memory)
    # types
        # NOR -- grid of cells, wired in parallel. less compact, less popular
        # NAND -- grid of cells, wired in series. more compact. more popularly used
            # SLC -- single-level cell (holds one bit)
            # MLC -- multi-level cell (holds two bits). higher capacity, wears out faster. preferred consumer tech.
    # science
        # semi-conductor chips (not magnetic storage)
        # silicon -- semiconductor
        # silicon doping 
            # n-type -- gains electrons (easier for electrons to flow out) (arsenic, phosphorous, antimony)
            # p-type -- loses electrons (easier for electrons to flow in) (boron, gallium, aluminum)
        # junction -- where n-type and p-type meet (normal silicon)
        # diode -- simplest semiconductor. allows current to flow in one direction (but not the other)
            # orientation of battery/current determines transmission/resistance.
            # when electrons are transmitted (cross the junction) they emit a photon.
        # transistors -- is electricity flowing through? (transmit / resist) (1 / 0)
            # NPN (n-type, p-type, n-type) or PNP (p-type, n-type, p-type)
            # bipolar transistor -- needs two kinds of charge for flow (ie: - + +)
            # unipolar transistor -- one kind of charge for flow (ie: +)
        # MOSFET
            # SSDs use MOSFET transistors -- NPN transistor with control gate and floating gate.
            # ones
                # applying a positive voltage to wordline & bitline (the transistor's two contacts)
                # this will cause electrons to get stuck in the floating gate indefinitely (1)
            # zeros 
                # applying a negative voltage on the wordline
                # this will cause electrons to leave the floating gate and return back.

# ------------
# file systems
# ------------

# windows
    # fat -- file allocation table
    # fat32 -- file allocation table (32 bit)
    # ntfs -- new technology file system
    # exfat -- recent technology, advantages over ntfs, can hold files over 4GB in size.

# linux
    # ext family (ext2, ext3, ext4)
    # xfs
    # btrfs

# deleting files and formatting drives loses data, but does not destroy it.
    # deleting removes entries in the fs, but the data is still in the hard drive
    # some softwares can recover deleted data

# ------------
# I/O devices
# ------------

 

# ------------
# OS
# ------------

# user --> application --> OS --> hardware

# operating system -- collection of programs that manage/coordinate activities in a computer.
# instruction set -- each CPU has an instruction set. OS must work with that specific instruction set.

# OS functions
    # once computer is booted at a basic level, OS is loaded from a secondary storage. OS finishes boot process.
    # user interface -- CLI and GUI
    # interfaces with hardware and runs hardware.
    # manage networking
    # manages security
    # manage resources (schedule jobs)
        # processor
        # memory (RAM)
        # device
        # storage
    # application interface 
        # application --> OS --> hardware
        # provides a stable way for applications to deal with hardware, without knowing all the hardware details.
    # user interface
    # file management

# OS types
    # embedded -- built into device. (ie: cash register, ATM, GPS devices)
    # mobile -- phone (android, iOS, windows)
    # desktop -- laptop/desktop (windows, ubuntu desktop, macOS )
    # server -- for performance, concurrent users, vertical scaling (red hat, ubuntu server, windows server)
    # mainframe -- cluster of servers. optimized for concurrency ()
    # super -- cluster of servers. optimized for speed

# kernel -- most basic level of control over the computer's hardware devices (with aid of firmware and drivers)
    # program execution
    # interrupts
    # modes
    # memory management
    # virtual memory
    # multi-tasking
    # disk access and fs
    # device drivers

# processing
    # singletasking -- doing one thing
    # multitasking -- doing multiple things
    # multiprocessing -- doing multiple things on multiple processors
    # parallel processing -- doing one thing on multiple processors


# ------------
# utility software
# ------------

# categories
    # antivirus
    # backup
    # clipboard manager
    # crypto
    # disk checker/cleaner/compression/defragmenter/partition
    # data sync (revision control)
    # network
    # system monitors
    # registry cleaner

# ------------
# drivers
# ------------



# ------------
# recovery
# ------------

# system restore
    # recovery partition
    # google 'factory restore ${computerModelName}'

# ------------
# network
# ------------

# PAN -- personal area network (ie: bluetooth)
# LAN -- local area network (ie: computers/devices connected in a building)
# WAN -- wide area network (cconnects several LANs for enterprise or public use) (ie: internet)
# MAN -- metropolitan area network (ie: network that spans several buildings)


# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------






# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------




# ------------
# 
# ------------



