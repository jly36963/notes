# COMPTIA A+

- CompTIA -- computing technology industry association
- most big tech corporations are part of CompTIA
- CompTIA A+ -- most popular IT exam.
  - 220 1001 -- core 1
  - 220 1002 -- core 2

## troubleshooting theory

- identify problem
- establish theory of probable cause
- test theory
- establish plan of action (resolve problem, implement solution)
- verify full system functinality (implement preventative measures)
- document findings, actions, outcomes

## desktop (internal)

- motherboard -- TODO
- chipset -- TODO
- cpu -- central processing unit
  - ALU (arithmetic logic unit) -- performs arithmetic and logical operations
  - control unit -- extracts instructions from memory, decodes/executes them.
    calls on ALU.
  - registers -- storage. supply operands to ALU and store results of
    operations.
  - cache (l1, l2, l3) -- storage. smaller, faster, closer to processor core
    than RAM.
  - I/O unit -- interface between CPU and I/O devices.
- thermal paste -- heat conductor between cpu and cooling system
- heat sync -- between cpu and fan (air cooling part) (increase surface area,
  help cooling)
- fans --
- liquid cooling system -- connect cpu to fan (coolant as thermal conductor)
- RAM -- TODO
- drives -- TODO
  - hdd -- magnetic storage (read/write head)
  - ssd -- static storage (MOSFET -- NPN transistor with control gate and
    floating gate.)
- power supply --
- front panel connectors --
- expansion slot (PCIe) -- houses expansion cards. (PCIe is most frequently
  used)
- video card -- TODO

## cpu

- companies
  - Intel
  - AMD (advance micro-devices)

- machine language
  - bit -- a binary value
  - byte -- 8 binary values

- operations
  - CPUs receive instructions and data to operate on
  - CPU understands instructions using an internal "code book"
  - cores have pipelines that use instructions to process/store/output data

- clock -- controls speed of operations
  - quartz crystal oscillator
  - motherboards operate at 100x MHz
  - modern CPUs operate at 1x GHz
  - clock multiplying fixes this.
  - overclocking increases clock rate, but at a risk.

- cache
  - caches -- l1, l2, l3 (usually 3)
  - caches operate much faster than ram, but are limited in space.
  - SRAM is expensive
  - storing data in these caches prevents pipeline stall

- microarchitecture -- design foundation on which families of CPUs are built

- cpu sockets
  - socket types
    - PGA -- pin grid array
    - LGA -- land grid array
  - socket names
    - intel
      - lga 1151
      - lga 2066
    - amd
      - ama4
      - tr4

## installing a new CPU

- safety
  - motherboard must match cpu socket, speed, and architecture
  - antistatic wristband when dealing with motherboard
  - don't touch the CPU directly, expecially the pins

- cpu
  - carefully put in, use orientation notch to determine orientation.

- fan
  - always use thermal paste between cpu and cooling system
  - different setup for every cooling system.
  - pay attention to orientation
  - fan requires power. plug into 4-pin connector (usually labeled cpu fan). all
    motherboards have this

- liquid cooling system
  - two hoses -- one in (cool), one out (hot)
  - liquid goes through radiator veins
  - fans are blowing through radiator to cool liquid

## RAM

- different motherboards support specific RAM technology.

- ram
  - core speed -- motherboard/crystal/clock speed
  - I/O speed -- MHz
  - PC Speed rating -- I/O speed rating * 8 (bytes --> bits)

- rating
  - DDR2/DDR3/DDR4 speed ratings will be prefixed with DDRX- (ddr speed) and
    PCX- (pc speed)

- SDRAM -- synchronous DRAM. synchronized with clock. 168 pins, 2 notches.
- DDR SDRAM -- double data rate SDRAM. 184 pins, 1 notch
- DDR2 -- double speed of DDR. 240 pin, 1 notch (not in same place as DDR).
- DDR3 -- double speed of DDR2. 240 pin, 1 notch (not in same place as DDR/DDR2)
- DDR4 -- double speed of DDR3. 288 pin, 1 notch
  - clock speed, bandwidth, DDR speed rating, PC speed rating

- dimensions
  - DIMM
  - SO-DIMM -- half size
    - some -- 200 pins or 144 pins
    - DDR3 -- always 204 pin
    - DDR4 -- always 260 pin

- capacity
  - capacity is done in squares (1, 4, 16, 32, 64, ...)
  - double-sided RAM for other capacities (2, 8, ...)

- channels -- slots for ram sticks
  - look at motherboard book for arrangements (which slots to use, based on
    number of sticks)
  - use same speed/size for all RAM. (you MUST use same speed in any given
    channel.)

- parity / ECC -- reduntant parity bit
  - most RAM have 8 chips (9 if ECC)
  - will function, even if (no more than) one chip fails.
  - protects against data corruption by automatically detecting and correcting
    memory errors
  - some motherboards can use ECC, some can't, and some require ECC

- SPD chip (serial presence detect) -- identifies the module to the BIOS during
  POST (characteristics/timings)

## motherboard (BIOS)

- BIOS
  - BIOS -- stored in firmware (built into the motherboard) that allows for
    communication to assumed hardware.
  - BIOS chip contains:
    - power-on-self-test (POST) to check assumed hardware before booting OS.
    - services -- BIOS programs that enable hardware to function.

- POST
  - POST runs at boot, requesting devices to self-check.
  - POST errors manifest as specific beep codes or display (text) codes
  - POST cards -- shows two hexidecimal digit combos that represent POST error.
    - installed by default on some motherboards. Can be installed.
  - Q-CODE (Error Code) table -- maps POST error codes to a description.

- UEFI -- unified extensible firmware interface
  - UEFI BIOS replaces traditional 16-bit BIOS in modern systems.

- system setup
  - customize the changeable parts of BIOS.
  - initiated during booot (hold specific key -- ie: Delete or F2)
  - security
    - an administrator password can be set (prevent unauthorized system setup).
    - a user password can be set (prevent unauthorized OS boot).
    - disable boot options
    - disable hardware (ie: front USB ports)

- firmware
  - real-time clock-battery keeps sytem time without external power
  - system setup allows for changes -- exit without saving is an option
  - 'reset system setup' for defaults
  - flash the ROM chip to update firmware
    - flash ROM to fix bugs and add new features to BIOS
    - this can ruin a motherboard. (some motherboards have a second/backup
      BIOS.)
    - make sure power does not run out.

- CMOS battery (CMOS RAM) -- small memory to store config details and BIOS
  settings.
  - leaking/failing CMOS battery can slow system clock and cause other problems.
  - CR2032 -- standard CMOS battery. provides power to RTC and CMOS.

- clear CMOS jumper -- short two poles (connect for 30s) to reset BIOS settings.

## motherboards (form factors)

- form factor -- standardization of motherboards. ensures part
  interchangeability
  - dimensions
  - power supply type
  - location of mounting holes
  - number of ports on back panel

- ATX -- most common form factor
  - 12" x 9.6"
- MicroATX
  - 9.6" x 9.6"
- Mini-ITX
  - 6.7" x 6.7"
- ITX
  - idk -- no info anywhere on it.

- I/O shield -- used to cover/support I/O ports. most conform to form factors.

## motherboard (chipsets)

- motherboards support specific chipsets.
- chipsets define supported hardware.
  - RAM capacity, USB capabilities, etc.

- originally, there were individual chips for everything (hard drive, floppy
  drive, sound card, serial ports, etc)
- chipsets -- dedicated chips that take on each of these responsibilities.
  - northbridge/southbridge
    - originally -- northbridge (cpu), southbridge (USB ports).
    - now -- CPUs handle northbridge responsibilities. chipsets are now just the
      southbridge.

## motherboard (tour)

- motherboards come with cables, standard connectors, and more

- SATA cables -- connect (SATA) hard drives to the motherboard (SATA HDD
  connectors).
- power connectors -- (the 2x4 grid thing)
- voltage regulators and capacitors -- adjusts/cleans power/voltage that is
  delivered to different components
  - capacitors -- flat on top is good. swollen/exploded capacitors signify a
    dead motherboard
- expansion slot --
  - PCIe -- (most frequently used) explansion slot technology. (successor to
    PCI)
    - expansion bus that uses serial connections. sends data on one wire,
      receives on on wire.
    - 16 lane (x16) -- full size slot (high bandwidth -- ie: graphics card)
    - single lane (x1) -- smaller PCIe slot (lower bandwidth -- ie: hard drive,
      network)
    - 4 lane (x4) --
    - 8 lane (x8)
- USB connector -- connects to dongle (which has external USB ports)
- USB port -- USB ports on motherboard
- serial port
- vga connector

## system unit (case) (tour)

- cases:
  - different sizes
  - different capacity for hardware
  - different cable management features.

- case sizes -- sizes are not precise, they vary between manufacturers/models
  - full tower -- 22" x 8" x 20". ATX motherboard (extended-ATX, ATX, micro-ATX)
  - mid-tower -- 18" x 8" x 18". ATX motherboard (ATX, micro-ATX)
  - Mini-ITX -- 15" x 4" x 13" Mini-ITX motherboard

- standoffs -- keeps motherboard above case. (motherboards probably have their
  own as well)
- pass-throughs -- ?
- hard drive bays/mounts -- area for hard drives (most common for HDD is 5.25")
- ssd mounts -- area for SSD to mount (2.5 inch SATA)
- power supply (area) -- where power supply mounts in. (doesn't really have a
  name)

## motherboard (mount/install)

- mount I/O shield on system unit. pay attention to orientation.
- install standoffs
- mount motherboard on standoffs
- make sure that I/O shield lines up with ports.
- connect motherboard cables
  - install components (cpu, cooling system, RAM)
  - connect front panel (power button, reset, etc)
  - questions? refer to motherboard/case documentations

## power supply

- power supply -- step-down transformer. convert AC power to DC power
  - 3 types of supplied power -- 12V (yellow), 5V (red), 3.3V (orange)

- cable connecitons
  - soldered power supply -- fixed cables. (possibly higher energy efficiency)
  - modular power supply -- detachable cables and ports. (convenient, less cable
    clutter)

- connectors
  - standard connector to motherboard -- 20 (or 24) pin ATX + 4-8 pin P4.
  - ATX12V -- extension to original ATX power that allow for additional power to
    motherboard.
  - Molex -- oldest power supply (4 pin) (12V and 5V)
  - SATA power connector -- primarily for hard drives (flat) (15 pin)
  - PCIe connector -- used for video cards. (6 pin)
  - mini-connector -- ?

- purchasing PSU
  - purchase based on watts
  - in a perfect world:
    - W = V * A
  - in the real world
    - W = V * A + entropy
    - there is entropy in the system (power lost)
    - get more watts than you think you need, to get appropriate volts.
    - use a wattage calculator (then add 10-20%)
  - power rating
    - 80 plus rating -- guaranteed 80% efficiency at all watt usage rates.
    - these ratings have higher efficiences: bronze, silver, gold, platinum,
      titanium

## cooling

- if (overheat) reboot();

- heat sink -- passive heat exchanger
  - transfers heat from a device to air/liquid for heat dissipation.

- fans come in various sizes
  - bigger fans can move slower. this means less noise.

- 4 pin (PWM) connector -- fan is managed by CPU (faster/slower)
- 3 pin connector -- fan is not managed (still connects to 4 pin port)

- fans can be controlled through firmware or software.
  - speed, warning beeps, when to turn on, etc.

## power supply troubleshooting

- power supply is the most likely thing to fail
- voltage will drop if PSU is unhealthy
  - use PSU testor or multimeter to test for voltage decline

- power supply deaths:
  - quick death -- burning smell, smoke.
  - slow death -- intermittent problems

## cpu + graphics

- intel -- all CPUs are CPUs
- AMD -- graphics built in ? (APU) : (CPU);

## mass storage device

- OS sees mass storage as a string of logical block addresses.

- logical block addressing (LBA) --
  - each block is about 4096 bytes
  - units in LBA are binary (kibi, mebi, gibi, tebi, pebi, exbi, zebi, yobi)

- ATA protocol (advanced technology attachment) -- "LBA language"
  - protocol used to communicate with drives.
- SATA (Serial ATA) -- computer bus interface. connects host bus adapters to
  mass storage devices.
  - SATA connector -- connects drive to motherboard (l-shaped)
  - SATA uses 1 wire to transfer data.
- NVMe (non-volatile memory express) protocol
  - faster -- get past the 6GB/s limit of SATA

- old school
  - parallel ATA
  - SCSI (small computer system interface)
  - modern "scuzzy"
    - SAS (serial attached sSCSI)
    - iSCSI -- SCSI over ethernet

- m.2 comes in both SATA and NVMe.

- sizes of storage
  - 5.25"
  - 3.5"
  - 2.5"
  - m.2

- storage methods
  - optical media -- optical storage
  - tape -- magnetic storage
  - hdd -- magnetic storage
    - magnetic disk drive
    - read/write head
    - track, sector, cluster
  - ssd -- flash storage
    - ssd --> die --> plane --> block --> page
    - block = 128 pages = 512KB

- eSATA --
- eSATA expansion card --

## boot order

- when a system boots, it looks for a bootable device

- set boot order in system setup
  - set order for storage devices to be searched.
  - boot order is defined in the CMOS system setup

## mass storage (RAID)

- RAID -- redundant array of inexpensive disks
  - hardware RAID requires a controller to configure the RAID arrays
  - hardware RAID has its own BIOS, with special system setup to configure
    array.
  - completed array looks like a single drive to the OS.
- go in system setup to change drives from AHCI --> RAID
  - reboot, press specified keys to configure raid
  - create array
  - select disks
  - select RAID array type
  - reboot

- striping -- spread data across multiple drives. increase read/write speed
- mirroring -- redundancy. identical data saved to two drives.
- parity -- a third disk is used to store XOR results of the first two. fault
  tolerance for striping

- RAID config
  - 0 -- striping (min 2 drives)
  - 1 -- mirroring (min 2 drives) (can lose 1)
  - 5 -- striping with parity (min 3 drives) (can lose 1)
  - 6 -- striping with double parity (min 4 drives) (can lose 2)
- nested RAID config
  - 01 -- stripe/mirror (min 4 drives) (ab ab)
  - 10 -- stripe/mirror (min 4 drives) (aa bb)
  - 05
  - 50
  - 06
  - 60

- hot spare -- specify a spare drive to be used on another's failure

## optical media

- disk anatomy
  - track -- single, continuous, grooved track that spirals outward. holds
    recorded data (light)
  - sector -- track is divided into sectors for data organization.
  - pits -- when data is written to disc, a laser beam creates dark,
    non-reflective areas on the disk
- reading
  - low intensity laser beam reads the disc.
  - transitions between pits/lands represent 1s, space between transitions are
    0s.
  - pits/lands don't represent 0s and 1s, the transitions and space between
    transitions do.

- optical media types
  - cd -- compact disc
    - ISO-9660 -- initial filesystem developed for CDs
    - CDFS
    - CD-R -- write once
    - CD-RW -- rewriteable
  - dvd -- digital versatile disc
    - DVD-ROM -- dvd read only memory
    - dvd version
      - DL -- double layered (two different depths)
      - DS -- double sided
      - dvd-5 -- ss/sl (4.37GB)
      - dvd-9 -- ss/dl (7.85GB)
      - dvd-10 -- ds/sl (8.74GB)
      - dvd-18 -- ds/dl (15.90GB)
    - standard inconsistency
      - dvd+rw
      - dvd-rw
      - at first, this caused problems
      - now, any optical media device can read both.
  - bluray

- capacity
  - CD -- 650-700MB
  - DVD -- 4.37-15.9GB
  - bluray -- 25-50GB

- optical media readers
  - SATA connection

## usb

- standards
  - USB 1.1 (1.5 Mbps or 12 Mbps)
  - USB 2.0 (480 Mbps)
  - USB 3.0 (5 Gbps)
  - USB 3.1 Gen1 (5 Gbps)
  - USB 3.1 Gen2 (10 Gbps)

- connector
  - USB type-A (downstream)
  - USB type-B (upstream)
  - USB mini-B (upstream)
  - USB micro-B (upstream)
  - USB 3.0 micro-B (upstream)
  - USB type-C (both)

- newer connectors
  - thunderbolt -- multi-purpose: charging, monitors, usb, etc
    - thunderbolt 1 -- 10Gbps (x2 channels) (mini displayport)
    - thunderbolt 2 -- 20Gbps (mini displayport)
    - thunderbolt 3 -- 40Gbps (USB Type C)
  - lightning -- charging, data transfer, etc
    - exclusive to apple (usually iOS) (iphone 5 and after connector)

- colors
  - white -- usb 1.1
  - black -- usb 2.0
  - blue -- usb 3.0 or 3.1 gen 1
  - teal -- usb 3.1
  - red -- charging ports (sometimes?)

- understanding USB
  - usb controller -- chip/device that allows the motherboard to communicate
    with the USB device
    - when a usb device is connected, it becomes subservient to the controller
  - connectors
    - A connector -- connects to host controller (downstream connection)
    - B connector -- connects to device (upstream connection)
  - hub
    - usb device --> root hub --> controller
    - root hubs for different speeds
    - usb ports connected to a root hub that supports usb 3.1 will probably be
      blue.
    - southbridge usually has controllers for multiple versions (1.1, 2.0, 3.1)
  - drivers
    - computers need drivers to operate hardware (ie: USB devices).
    - computers will often find and install drivers for devices automatically.
    - many device drivers are signed (verified) by Microsoft.
  - HID (human interface device)
    - core device drivers
    - core functionality for keyboards and mice should work
    - extra feature will require additional drivers
  - security
    - disable USB ports
    - USB lock (software) -- selectively monitor and prevent unauthorized usage

## keyboard, mouse, kvm

- keyboards use either USB or PS/2 (PS/2 -- keyboard purple, mouse green)
- mice almost exclusively use USB
- kvm switches (keyboard video mouse) -- enable multiple computers to share I/O
  devices

## expansion slot

- remove protective cover
- put card in to appropraite PCIe slot
- establish power connection
- screw mounting bracket onto case

- with graphics card:
  - check that graphics card can match monitor resolution (if using card for
    graphics)
  - make sure to use all screws when mounting
  - connect power supply
  - system setup to select primary graphics card.
  - update drivers (windows or manufacturer drivers)

## i/o peripherals

- memory cards
  - sd
  - micro-sd
  - xd

- smart card/magnetic readers -- read cards
- flash memory readers -- read flash memory (usually memory cards)
- scanners & ADF -- scan pages
- barcode/QR code scanners -- read printed coded labels

- troubleshooting
  - handle cards carefully
  - verify connections (power, data, etc)
  - add correct driver (update too)
  - new devices installation is a common cause for BSOD

## monitor

- resolution -- dimensions of pixels (individual picture elements)

- LCD (liquid crystal display)
  - let light pass or block it
  - backlight
    - CCFL (cold cathode flourescent lamp) -- first backlight
    - LED (light emitting diodes) -- more frequently used backlight
      - light emitting diode -- organic compound that emits light in response to
        current
  - LCD tech
    - TN (twisted nematic)
    - IPS (in plane switching)
  - brightness
    - Nit (nt) -- unit of brightness
    - most panels run from 200-500 nits
  - speed
    - used to be measured as "refresh rate" (Hz)
    - now measured in response time (ms)
      - how fast a pixel goes from black --> white --> black

- OLED (organic light emitting diode)
  - OLED screens don't require a backlight, because a single diode emits both
    light and color
  - extremely thin, flexible, and even rollable.

- DLP (digital light processing) -- used more in projectors
  - grid of tiny mirrors

## LCD/CCFL monitor (anatomy)

- LCD screen
- backlight unit -- distributes light from the CCFL (tubes) or LED backlights
- data inputs
- power connection
- power supply -- AC to DC power
- inverter -- DC back to AC power (for fluorescent lights)
  - LED doesn't need inverter

## projectors

- technologies
  - DLP
  - LCD
- brightness
  - measured in lumens
- bulbs
  - bulbs are expensive and can burn out
  - LED last long
- projection
  - throw -- distance from lens to projected surface
  - pincushion -- ( ) or ) (
  - keystone -- trapezoid
  - skew -- parallelogram

## graphics card

- GPU (graphics processing unit) -- video card
- GPUs have their own memory

- companies
  - NVIDIA
  - ATI/AMD
  - intel (motherboard graphics cards)

- connectors
  - vga (video graphics array) -- analog signal. 15 pins (3 rows). usually blue.
  - dvi (digital visual interface) -- digital signal.
    - requires configuration
    - link
      - single link -- two groups of pins with space between
      - dual link -- all pins (no space)
    - digital/analog
      - dvi-i -- digital and analog (white) (cross with dots)
      - dvi-d -- digital only (black) (dash)
  - hdmi (high definition multimedia interface) -- digital
  - mini-hdmi -- digital
  - displayport -- digital
  - mini-displayport -- digital

## networking

- MAC vs IP
  - MAC -- physical
  - IP -- logical

- LAN
  - LAN (Local Area Network)
  - ethernet
    - LAN uses ethernet to connect computers.
    - ethernet requires data to be transferred in chunks (frames).
  - identification
    - devices are uniquely identified by MAC (media access control) address
    - MAC addresses consist of 12 hexidecimal numbers (12 hex * 4 bits/hex = 48
      bits)
    - view MAC address
      - windows -- ipconfig
      - unix -- ifconfig
  - check frame
    - FCS (frame check sequence) -- error-detecting code added to a frame in
      communication.
  - frame --
    - chunks of 1500 bytes.
    - destination MAC, source MAC, data, FCS
    - OS manages frames.

- common (LAN) networking devices (switches > hubs)
  - switch
    - collects MAC addresses on connect.
    - data is only sent to intended MAC address
    - smart repeater
    - hardware limitations
      - maximum 1024 devices (if switches are daisy chained)
      - gets overloaded at ~30 devices
  - hub
    - shared throughput (bottlenecking)
    - repeat traffic to all other nodes

- WAN (wide area network)
  - routers connect multiple LANs together in a WAN
  - routers use logical addressing (IP addressing) to distinguish between
    local/remote traffic

## network cables

- ethernet
  - speed: 10BaseT (10 Mbps baseband twisted pair), 1000BaseT, 10Gb base T
  - materials: copper, fiber-optic
- coaxial
  - RG ratings: RG-58 (old), RG-59, RG-6
  - connectors: F-type, BNC connector
- twisted pair
  - UTP (unshielded twisted pair)
  - connectors
    - RJ-45
    - telephone: RJ-11
- shielded twisted pair
  - more robust than regular twisted pair
- fiber optic:
  - light, rather than electrical pulses
  - methods of propogating light signal
    - multimode: LED.
    - singlemode: Lasers
  - wires come in pairs. one to send, one to receive.

- CAT ratings
  - cat 5 -- 100Mbps
  - cat 5e -- 1Gbps
  - cat 6 -- 1Gbps for 100m or 10Gbps for 55m
  - cat 6a -- 10Gbps for 100m (currently the most-used)
  - cat 7 -- 10 Gbps for 100m, shielded
- fire ratings
  - plenum
    - cable with fire-resistant jacket
    - ok to use in ceiling or floor cavity
  - riser
    - run between floors in a building
  - pvc (non-plenum)
    - no fire protection

## crimp network cables

- crimping cables
  - items
    - cable
    - crimp -- each has a CAT rating
    - crimp tool
  - cut off ~1" of jacket
  - untwist wire pairs
  - line up wires
    - TIA 568A -- green(w), green(s), yellow(w), blue(s), blue(w), yellow(s),
      brown(w), brown(s)
    - TIA 568B -- yellow(w), yellow(s), green(w), blue(s), blue(w), green(s),
      brown(w), brown(s)
    - blue and brown don't change
  - orientation
    - straight through -- same order on both sides
    - crossover -- different standard on each end
  - crimp
    - to maintain CAT rating. crimp location must be within .5" of last twist

## structured cabling

- rack
  - switch
  - patch panel
  - servers
  - cooling

- MDF (main distribution frame) -- where network hardware is stored
- 19" standard rack (19" width. height is measured in "u" units)
- horizontal run -- run that goes to different wall outlets in LAN
  - TIA rules -- longest run is 90m
- patch panel -- connects horizontal runs (via patch cables)
  - punchdown tool to connect patch cables to patch panel
  - order of cables differs between panels

- switch --> patch panel --> horizontal run

- UTP
  - solid core (has copper) (wall cable)
  - stranded (patch cable)

- troubleshooting
  - tone generator/probe to differentiate cables
  - TDR for testing runs

## IP

- ARPANET formed (basis for internet)
- TCP/IP adopted as protocol for ARAPNET/internet

- dest MAC, source MAC, destination IP, source IP, data, fcs

- IP Adresses
  - function
    - identify which LAN
    - give unique host ID
  - static vs dynamic
    - static IP address
      - set up manually in settings
    - dynamic IP address
      - DHCP (dynamic host configuration protocol) server
        - device gets turned on, makes request to DHCP server.
        - server (often a gateway router) will assign IP, subnet mask, default
          gateway
        - four parts to DHCP conversation: discover, offer, request, acknowledge
      - APIPA (automatic private IP addressing)
        - fallback if no DHCP (client can't find server)
        - most OS have this
        - always a 169.254.x.x address
  - ranges -- each of the following types have different ranges of IP address
    options
    - public -- open to the internet
    - private -- private network only.
    - loopback -- your device (127.0.0.1)
  - IPv4
    - 4 octets (between 0 and 255)
    - from 0.0.0.0 to 255.255.255.255
      - can't end in 0 or 255 (0 identifies an entire LAN)
      - starts with 1 -- reserved for experimentation
    - classes
      - class c -- last block (254 host options)
      - class b -- last two blocks (65534 host options)
      - class a -- last 3 blocks (millions of host options)
  - IPv6
    - 128 bit addressing scheme
    - 32 digits (8 groups of 4), 7 colons, hexadecimal notation
    - leading zeros can be truncated, triple zeros can be replaced with ::
      - 2001:0:0:1:0:0:0:8a2e --> 2001:0:0:1::8a2e
    - minimum 2 IPv6 addresses
      - link-local address
        - starts with fe80, bunch of zeros, system generates last half
      - internet address (global unicast address)
        - internet gateway determines first half, system generates last half
      - temporary addresses
        - a bunch of these (throwaway addresses)
          - security feature

- to connect to internet, a computer needs: (provided by DHCP server)
  - IP address
  - subnet mask (local call)
  - default gateway (long distance calls)

- rogue DHCP server
  - DHCP server that isn't controlled by admin/staff.
  - rogue server offers new gateway and IP addresses to devices.
  - as the default gateway, it has full control over every packet sent to/from
    the connected device.
  - man-in-the-middle-attacks

## NAT

- gateway router
  - connection to LAN (internal)
  - connection to WAN (external -- to ISP)

- NAT (network address translation)
  - reduces number of IP addresses by encapsulating (private) IP addresses in
    LANs

- NAT + gateway
  - router will have public IP address
  - devices in LAN will have private IP addresses

## ports

- ports
  - range
    - 0 - 65535
  - categories
    - well known ports (0 - 1023) (don't use)
    - registered ports (1024 - 49151)
    - ephemeral ports (49152 - 65535)
  - common ports
    - 21 ftp
    - 22 ssh
    - 23 telnet
    - 25 smtp
    - 53 dns
    - 67/68 dhcp
    - 80 http
    - 110 pop3
    - 137 - 139 netbios/netbt
    - 143 imap
    - 161/162 -- snmp
    - 389 ldap
    - 427 slp
    - 443 https
    - 445 smb/cifs
    - 3389 rdp

- IP address -- which computer
- port -- which service

- request -- dest IP, source IP, dest port, source port, data

## TCP, UDP, and ICMP

- TCP/IP -- transmission control protocol / internet protocol
  - connection oriented protocol
  - handshake
- UDP -- user datagram protocol
  - connectionless protocol
- ICMP -- internet control message protocol
  - single packet only

- PDU (protocol data unit) -- packets are organized by PDUs
  - TCP segment
  - UDP datagram

## DNS

- FQDN (fully qualified domain name)
  - 256 character limit

- DNS (domain name service)
  - DNS uses a hierarchical organization to resolve FQDNs to IP
  - DNS server will resolve FQDN to IP address
    - computer and DNS will both cache the result

- hosts file -- before DNS.

- DNS records
  - A Record -- websites
  - MX Record -- mail servers
  - Cname -- multiple names

- troubleshooting
  - alternative DNS servers can be used
  - nslookup -- tool to verify DNS server is running

## windows naming

- netbios/netbt -- naming system for LAN

- upon windows installation, system will be a member of:
  - workgroup
    - basic type of network org
    - no security, no central administration
    - okay for small networks
  - active directory domain
    - requires windows server installation
    - security, central administration
    - good for enterprise environments, expensive

## routers

- router -- filter and forward traffic (based on IP addresses)

- routing table
  - tells router where to forward IP packets
  - every routing table has a default gateway that sends all data unless
    otherwise specified

- a SOHO router is usually combined with a switch, wireless access point, or
  modem.

- router will send out DHCP range to LAN connected devices
- router usually has an upstream DHCP server (gives them an IP address, subnet
  mask, default gateway, and DNS info)
- router is a DHCP client. it can be given a static address ('ipconfig' will
  show default gateway as such)
- default gateway is usually the router

## advanced router configuration

- QoS (quality of service)
  - specify allocation of bandwidth
  - based on IP, MAC, or port
  - options might be as follows (fastest to slowest): exempt, premium, express,
    standard, bulk

- UPnP (universal plug and play)
- Link Layer Discovery Protocol
  - windows default
- SNMP (simple network management protocol)
  - tool for network administrators to get details about switch/router/etc

## VLAN

- managed switch -- more expensive, additional features (VLAN among them)
  - VLAN -- has physical switch that creates separate network switches (separate
    LANs)
  - customize VLAN
    - switches usually only have MAC address. read manual or look online about
      giving it IP address.
    - in his example, the managed switch uses DHCP to get IP address.
    - use IP address in broswer to manage switch via GUI (firmware interface).
      - may require password
    - allocate ports to seperate VLANs
  - port security
    - disable ports based on MAC address

## wireless networking

- IEEE 802.11 -- (most popular) wireless standard
- WAP (wireless access point) -- bridge between wired network and wireless.

- IEEE 802.11 modes
  - infrastructure mode -- use WAPS. (most common mode)
  - ad hoc mode -- a device functions as WAP and others connect to it

- wireless network card
  - built in to motherboard
  - via PCIe connection
  - via USB connection

- antenna types
  - omnidirectional -- radiates and receives energy equally well in all
    directions.
  - dipole -- omnidirectional antennas pointing in opposite directions.
    propogates horizontally
  - patch -- half a sphere (ie: if you are against a wall. equal reach in all
    directions away from wall.)
  - highly directional -- specific direction.
    - parabolic antenna functions similarly.

- wifi standard
  - IEEE 802.11
    - based on ISM radio bands (industrial, scientific, and medical)
    - 2.5 GHz -- 2.412 - 2.484 GHz. 14 channels (sometimes less channels, based
      on area)
    - 5 GHz -- 5.150 - 5.875 GHz. weird channel setup. 36-64, 100-144, 149-165,
      many are skipped.
  - extensions to IEEE 802.11
    - 802.11a -- 54 Mbps, 5 GHz
    - 802.11b -- 11 Mbps, 2.4 GHz
    - 802.11g -- 54 Mbps, 2.4 GHz (backwards compatible with 802.11b)
    - 802.11n -- 100 Mbps, 2.4 & 5 GHz (backwards compatible with all) (MIMO --
      multiple in / multiple out)
      - wifi 4
    - 802.11ac -- fast, (2.4 GHz backward compatibility) (multiple user MIMO)
      - wifi 5
  - WAP will often choose channels automatically

- WAP setup
  - SSID (service set identifier) -- network name
  - for WAP to allow client connection, an SSID must be set
  - most WAPs can support SSIDs (ie: one for 2.4 GHz and one for 5 GHz)
  - SSID broadcast can be disabled (CompTIA thinks that's a good idea)
  - mode can be changed to increase throughput
  - transmit power -- strength/reach of signal.

- connecting to wifi
  - wireless clients can scan the 802.11 spectrum to find available SSIDs
  - select SSID and enter password to connect
  - clients create profiles that store SSIDs/passwords.
  - saved connection isn't working, you might need to forget network. (password
    or IP config change, etc)

- WMN (wireless mesh network) -- increases reach of signal using nodes
  (organized in mesh topology)
  - gateway (router), mesh router (node), mesh client (connected device).
  - nodes increase range/coverage
  - security
    - set SSID and password
    - built in, 3rd party encryption

- other wireless mediums
  - RFID (radio frequency identification) --
    - mostly used in industrial settings.
    - sticker gets powered by scanner and transmits signal back to scanner.
    - low power, must be very close
  - NFC (near field communication)
    - type of RFID
    - "tap to pay", "tap to print"
  - bluetooth --
    - similar to 802.11
    - designed to only connect 2 devices
    - PAN (personal area network)
    - bluetooth classes
      - class 1 -- 100m, 100mW
      - class 2 -- 10m, 2.5mW
      - class 3 -- 1m, 1mW

- wireless troubleshooting
  - profiles will cause errors if SSID/password has changed
  - low RF signal, no connectivity.
    - move closer to source
    - adjust antennas
    - increase transmit power.
    - limit number of devices
    - remove things causing interference
  - wifi analyzer can find interference from devices using ISM bands (baby
    monitors, microwave, etc)

## internet

- networks
  - LAN (local area network) -- group of locally connected computers
  - WAN (wide area network) -- connected LANs
  - MAN (metropolitan area network) -- a large area of connected LANs
  - internet -- largest WAN
  - PAN (peronal area networks) -- point to point connections (bluetooth)

- internet tiers
  - internet is composed of many interconnected organizations
    - peering -- providers allowing each other to pass through traffic.
      - symbiotic relationship that allows each provider to have increased
        coverage
    - network operation centers -- 3rd party building that host / allow for
      peering
  - Tier 1 -- providers that do not pay anyone (may use peering)
  - Tier 2 -- providers that pay some Tier 1s but also peer
  - Tier 3 -- providers that pay Tier 1 / Tier 2 providers.

- dialup connections
  - POTS -- plain old telephone service
    - first generation internet -- using a system that sends analog to send
      digital
    - modem (example) -- RJ-11 input, RJ-11 output (to phone), DB-25 serial
      output (to computer)
    - supports 56 Kbps speeds
  - idk what these are for
    - PSTN -- public switched telephone network
    - ISDN

- broadband connection
  - DSL (digital subscriber line) --
    - DSL terminal adapter ("DSL modem")
    - DSL speed
      - asymmetric -- faster download, slower upload
      - symmetric -- same speed for download/upload
    - many DSL require PPPoE (point to popint protocol over ethernet)

- cable
  - uses DOCSIS protocol (data over cable service interface specification)

- satellite
  - good for remote locations
  - latency

- 802.11
  - use an antenna to connect to a tower

## firewalls and servers

- firewall -- primary function is to block specified ports
  - clients and servers use firewalls
  - stateful (different rules for inbound/outbound traffic)

- home routers often allow outbound port 80, but not inbound
  - web appliation will send request (ie -- source port: 14321, destination
    port: 80)
- web servers will allow inbound port 80

## communication

- http -- 80
- https -- 443

- ftp (file transfer protocol) -- port 21
  - needs an ftp client (web browsers work, but there are better ones)
  - ftp site -- starts with "ftp" (ie: ftp://some-domain.com)
  - ftp server
  - passive/active mode
    - passive -- request (source: 14161, dest: 21), response (source: 21,
      dest: 14161)
    - active -- request (source: 14161, dest 21), response (source: 14161,
      dest: 20)
    - active is a lot faster, but firewall might block response.
      - port triggering (router) helps overcome this.
      - add trigger, specify trigger port (21) and external port (20)

- email
  - requires hostname, username, password
  - protocols
    - smtp (simple mail transfer protocol) -- port 25 (port 465 for secure)
      - send emails
    - imap (internet message access protocol) -- port 143 (port 993 for secure)
      - receive emails from a remote server to local email client
      - emails can be accessed from multiple clients
      - more frequently used than pop3
    - pop3 (post office protocol) - port 110 (port 995 for secure)
      - receive emails from a remote server to local email client
      - downloaded locally and removed from email server

## VPN

- VPN (virtual private network)
  - use the internet to create a private connection to a remote network
  - VPN client -- connects to WAN side of router (VPN tunnel connection)
    - VPN client needs to know the IP adress of the VPN server to connect
    - DHCP server gives client an IP address.
    - VPN protocols include PPTP, L2TP, IPsec
  - VPN routers will often require specific client software

## IoT

- IoT -- internet capability to devices not traditionally associated with the
  internet
  - most common connections: 802.11, Zigbee, Z-wave
  - requires a hub to link to the IoT devices
  - Google Home, Amazon Alexa, Apple Siri add voice capabilities to IoT

## virtualization

- virtual machine -- self-contained computer, running within a host operating
  system.
- hypervisor -- host that runs virtual machines
  - type 1 -- hardware, hypervisor (OS), VMs
    - examples -- VMware ESXi, Microsoft Hyper-V, KVM
  - type 2 -- hardware, OS, hypervisor (application), VMs
    - example -- VirtualBox (Oracle)

- virtualization -- allocate hardware resources to a virtual machine
- emulation -- software construct attempting to replace a hardware component

- virtualization must be enabled in system setup

## cloud

- cloud computing -- using a network of remote servers to store/manage/process
  data
  - network is accessible via IP
  - enables elasticity, scaling, and resource pooling

- cloud services
  - IaaS (infrastructure as a service) -- cloud platform for networks
    - moves network tasks such as firewalls into the cloud
  - PaaS (platform as a service) -- cloud platform for running apps
  - SaaS (software as a service) -- cloud platform for using services

- cloud ownership
  - private cloud -- owned/used by a sigle organization
  - public cloud -- privately owned but available for public use
  - hybrid cloud -- both public and private aspects
  - community cloud -- owned by multiple organizations for their own private use

- cloud based applications
  - cloud storage -- access to synchronized saved files
  - move management to the cloud (email)
  - virtual desktops -- consistent workspace, accessible from any
    (authenticated) device
  - virtual application streaming -- access to apps without installing them

## laptops

TODO

## securing computers

- host based security
  - patch your software (OS and application)
  - run anti-malware
  - run a host-based firewall
- network based security
  - IDS (intrusion detection system) (less used)
  - IPS (intrusion prevention systems) (more frequently used) (expensive) (needs
    central administration)
    - endpoint management
  - UTM (unified threat management)
    - network firewall
    - intrusion protection
    - anti-malware
