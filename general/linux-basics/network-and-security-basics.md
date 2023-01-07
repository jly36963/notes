# Networks and security

## Network components

- IP
  - IP address -- numerical label assigned to each device connected to a
    computer network that uses IP for comm.
  - TCP/IP -- standard for network communication. uses IP as unique identifier
  - IP address standards:
    - IPv4 -- 32 bits. four octets, separated by periods.
    - IPv6 -- 128 bits. 8 groups of hex numbers, separated by colons.
  - subnetting -- dividing a network into multiple
  - a network may also be characterized by its subnet mask (for IPv4)
  - IPv4 classes
    - class a -- 1-127 first octet range, 255.0.0.0 subnet mask, 126 networks,
      16m hosts,
    - class b -- 128-191 first octet range, 255.255.0.0 subnet mask, 16k
      networks, 65k hosts,
    - class c -- 192-223 first octet range, 255.255.255.0 subnet mask, 2m
      networks, 254 hosts,
  - IP details
    - network and node portions (netwwork ID + host ID) (they identify the
      correct destination network and node)
  - gateway -- network node that connects two networks (using different
    protocols) together
    - router -- common gateway.

  - bridge -- used to connect two similar types of networks.
  - static / dynamic IP
    - static -- dedicated IP, does not change
    - dynamic -- gets assigned by a DHCP server (from a pool of IP addresses,
      within available DHCP scope on network).
  - interfaces
    - ethernet interface -- usually the NIC (network interface card) on the back
      of a computer.
    - virtual interface -- exist in software only (in virtualization).
  - MAC address (media access control) -- every NIC has a hardware address
    (physical or virtual)
    - six sets of two characters, separated by colons.

- TCP/UDP (reside on the transport layer of the OSI module)
  - computers communicate to send/receive data
  - TCP (transmission control protocol)
    - connection based protocol.
      - must acknowledge session between two communicating computers
      - connection must be verified before communication.
      - three way handshake
        - computer sends message (SYN) to another computer
        - receiving computer will send back acknowledgement.
        - sender computer sends another acknowledgement back to the receiver
    - ensures that the data is received correctly and that communication is
      good/reliable
    - data is complete and in correct order
    - if a data packet goes astray and doesn't arrive, TCP will resend it.
  - UDP (user datagram protocol)
    - connection-less
    - does not guarantee data delivery (fire and forget)
    - faster than TCP

- OSI model (open systems interconnection)
  - conceptual framework that describes the functions of a networking /
    telecommunication system
  - model
    - 1: Physical -- conveys the bit stream across the network
      - conveyes either electronically, mechanically, or through radio waves
    - 2: Data Link -- node-to-node data transfer (between two directly connected
      nodes).
      - handle error correction from the physical layer
      - two sublayers: MAC (media access control) and LLC (logical link
        control).
    - 3: Network -- responsible for packet forwarding. determines how data gets
      from source to destination.
    - 4: Transport -- coordination of the data transfer between host/destination
      (amount, speed, etc)
    - 5: Session -- manages connection between local and remote application.
      (session management)
    - 6: Presentation -- preparation/translation of application format to
      network format
    - 7: Application -- users interact with directly.

- NIC
  - NIC (network interface cards) -- hardware adapters, provide ports for
    network connectivity.
  - might be built in to motherboard or added (USB, PCIe, etc)
  - available in 1-4 port config on a single adapter
  - multiple interfaces can be configured to provide bonding/teaming for
    redundancy.
  - individual interfaces and bonding can both be configured with IPv4 and IPv6
    assignments (in config files)
- NIC config
  - each network interface has a config file that stores IP addresses and other
    relevant parameters.
  - system reads this file and applies settings once the interface is activated.

```zsh
# ip
ip a; ip addr; # show interfaces and their IP/MAC addresses
ip r # show RT
hostname -I # ip addresses
# ss (socket statistics)
ss

# list hostname
hostname
# list hostname (and other system details)
hostnamectl
# set hostname (requires reboot to reflect change)
hostnamectl set-hostname new_name
# change by editing hostname file
nano /etc/hostname

# ip addresses
hostname -I 

# network config files/settings
ls /etc/network # files (ubuntu)
cat /etc/sysconfig/network-scripts/ifcfg-* # settings (CentOS)
cat /etc/sysconfig/network/ifcfg-* # settings (openSUSE)
# hosts (hostnames, IP addresses)
cat /etc/hosts 
# resolver config file -- specifies (1) IP address of DNS server and (2) search domain
cat /etc/resolv.conf 
# name server switch (maps system identities/services with config sources)
cat /etc/nsswitch.conf
```

- NIC bonding
  - skipped

- network manager (DOES NOT WORK IN WSL)
  - yum install NetworkManager-tui
  - apt install network-manager
  - zypper install NetworkManager

```zsh
nmtui 
nmcli
```

- ping
  - used to test connectivity status between source & destination over an IP
    network.
  - assess time between sending request and receiving response.
  - ping packet -- a 64-byte ICMP packet (56-byte without header)
  - ping command send a series of ping packets from server A to server B

```zsh
ping google.com
ping -c 3 -i 5 google.com # ping (args: pings, interval in seconds)
```

## firewalls

- firewall -- protective layer between private/public network to filter traffic.

- command-line firewall utilities that manage firewall rules
  - iptables
  - firewall-cmd (client for firewalld daemon)

### iptables

```zsh
# is iptables installed
yum list installed | grep iptables
apt list --installed | grep iptables
# see config
cat /etc/sysconfig/iptables* # 'iptables' or 'iptables-config'
# start iptables
systemctl enable iptables
systemctl start iptables
# stop iptables
systemctl stop iptables
systemctl disable iptables
# rules
iptables -L # list rules
iptables -F # remove all rules
# insert rule (allowing traffic from a specific IP address on a specific port)
iptables -I INPUT -s 192.168.1.0/24 -p tcp --dport 90 -j ACCEPT
```

### firewalld (daemon)

```zsh
# install firewalld
yum install firewalld
# use firewalld
systemctl enable firewalld # start on boot
systemctl start firewalld # start service
systemctl status firewalls -l # 
# stop firewalld
systemctl stop firewalld
systemctl disable firewalld
```

### firewall-cmd -- client CLI for the firewalld daemon

```zsh
# state
firewall-cmd --state # state of firewall (ie: running)
# add runtime rule to allow traffic on TCP port 443
firewall-cmd --add-port=443/tcp 
firewall-cmd --permanent --add-port=443/tcp # load this rule every server boot
# reload
firewall-cmd --reload
# list services
firewall-cmd --list-services
# list ports
firewall-cmd --list-ports
```

## security tips

- physical security
- keep software updated
- principle of least privilege
- encryption
- avoid non-secure protocols
- good password policy
- disable root login
- minimize number of services (disable unneeded services)
- implement firewall
- separate partitions
- configure SSH safely (don't use default port 22)
- perform scans (nmap, Nessus)
- configure user sudo access
- use `last` and `lastlog`
- additional tools -- wireshark, snort, aircrack, john the ripper
