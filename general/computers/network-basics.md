# Network

## Network models

- Used to represent how networks function
- OSI model is supplanted by TCP/IP model

- OSI seven-layer model
  - layers
    - physical: electrical/phsyical repr of system
    - data link: node-to-node transfer (sublayers: MAC/LLC)
    - network: routing (eg: IP)
    - transport - when/where/how to send data (eg: TCP/UDP)
    - session: session coordination between computers
    - presentation: conversion of network to app-usable format
    - application: the network api for an app (eg: http, ftp, smtp, dns)
- TCP/IP model
  - network interface (link): physical, data link (eg: MAC addrs, network cards)
  - internet: network (eg: IP addrs and routers)
  - transport: transport (eg: TCP/UDP)
  - application: app/pres/session layers

### Frames & Packets

- frame: discrete chunk of data
  - up to ~1500 bytes
- network interface cards (NIC)
  - receive data, convert to frames, and send to network
  - receive frames, data is pulled and sent to the app
- packets are always encapsulated within some kind of frame
- frames have frame check sequence (FCS)
  - FCS is four-octet cyclic redundancy check (CRC)

### MAC Address

- MAC address: 48-bit identifier for a NIC (physical address)
- 12 hex characters * 4 bits each = 48 bit
  - OEM: first three pairs, unique ID: last 3 pairs
- Frames have dst and src MAC addresses
- Broadcast vs unicast
  - unicast: known dst, addressed to single device
  - broadcast: unknown dst, sent to every device in broadcast domain
    - MAC Adress: `ff-ff-ff-ff-ff-ff`
    - broadcast domain: group of computers that hear each other's broadcasts

### IP Addressing

- most predominant version of logical addressing is IP addessing
- when communicating outside broadcast domain, frame includes an IP address
  - IP packet is part of the frame
    - src/dst IP addrs and data
- default gateway: connection to router
  - a router connects multiple LANs

### Packets and Ports

- port: virtual point where network connections start and end
- ports are software-based and managed by a computer's OS
- ports allow computers to distinguish traffic from multiple processes

## Cables and Topology

- topology: physical and logical arrangment of nodes/connections in a network
  - bus
  - ring
  - star
  - star-bus (primary topology used today)
  - mesh (fully- vs partially-meshed)

- cabling
  - coaxial
    - two conductors, one center point, tubular conducting layer
    - RG specifies thickness of conductors, insulation, and shielding
    - TV/cable use RG-59 or RG-6
  - twisted-pair
    - most common cabling for networks today
    - shielded vs unshielded (STP vs UTP)
      - shielded is more expensive, has metal/foil that blocks EMI, stiffer
    - in networks, most commonly
      - 4 twisted pairs
      - RJ-45 connector
    - CAT ratings
      - determine speed over distance, shielding, etc
    - T568A and T568B:
      - how wires meet connector
      - different positions for orange and green
      - T568B is most commonly used, T568A is seen as better
  - fiber-optic
    - duplex cables: one to send, one to receive
    - mode
      - device and cable mode must match
      - multimode
        - carries LED light signals
      - single-mode
        - carries laser signals
        - bidi (bidirectional)
          - two different laser colors on same cable
    - connectors
      - older, separate cables
        - ST: push in, turn
        - SC: push in
        - FC: screws in
      - newer, joined
        - LC
        - MT-RJ
    - contact & polishing
      - PC: physical contact (slightly rounded)
      - UPC: ultra physical contact (more rounded)
      - APC: angled physical contact (7-degree angle cut)

- fire ratings
  - plenum
    - cable with fire-resistant jacket
    - ok to use in ceiling or floor cavity
  - riser
    - run between floors in a building
  - pvc (non-plenum)
    - no fire protection

## Ethernet Basics

- Ethernet: defined by IEEE 802.3 standard
  - standard versions: 802.3a, 802.3b, 802.3i, ...
  - ethernet frame
    - composition:
      - preamble: tells receiving system that frame is starting
      - SFD: state frame delimiter, signifies dst MAC begins at next byte
      - dst/src MAC addrs: physical addresses of sending/receiving systems
      - type: ether (data) type
      - data and pad: payload data, padded if less than 46 bytes
      - FCS: frame check sequence, 32-bit CRC
    - 64 - 1522 octets (bytes)
    - vast majority of data on internet is on ethernet
  - jumbo frame
    - up to 9000 bytes

- MTU: maximum transmission unit

- Ethernet history
  - 10Base5 (10 Mbps, base, for 500m)
    - network goes down if ethernet breaks
  - Token Ring
    - expensive, but more robust
  - 10BaseT (10 Mbps, base, <100m between switch and node)
    - fundamental network topology that later versions of ethernet use
    - no more than 1024 nodes
    - Cat3 or better UTP cable
  - 100BaseT (100 Mbps ethernet)
    - around the time of two fundamental changes
      - hub -> switch
      - half duplex -> full duplex (sending & receiving at same time)
    - standards: 100BaseTX compeated with and beat out 100BaseT4
  - 1000BaseT:
    - standards:
      - 1000BaseCX: twinax coax
      - 1000BaseSX: fiber-optic (multimode)
      - 1000BaseLX: fiber-optic (single-mode)
      - 1000BaseT: UTP
  - 10GBaseT:
    - standards:
      - 10GBaseSR: fiber-optic (multimode)
      - 10GBaseLR: fiber-optic (single-mode)
      - 10GBaseER: fiber-optic (single-mode)
      - also SW, LW, EW for SONET networks

- ethernet cable
  - composition
    - UTP cable, terminated with RJ-45 (8P8C) connectors
    - 4 twisted pairs, arrange to T568A or T568B, crimp into connector
  - combinations
    - straight-through -- same on both ends
      - majority are straight-through
    - crossover -- one T568A end and one T568B end
      - connect switches directly with crossover cables

- MSA: multisource agreement
  - allow a switch to support mutliple types of fiber-optic connectors
  - GBIC: gigabit interface converter (for ST and SC connector modules)
  - SFP(+): small form-factor pluggable (for LC and MT-RJ)

- switch problems
  - looping
    - STP will turn off ports
  - flooding
    - flood guard will turn of ports
  - speed mismatch
    - match switch speeds to avoid slowdown

## TCP/IP Basics

- TCP: transmission control protocol
  - connection-oriented conversation between two computers
  - ensures data arrives complete and in order
    - uses sequence number to notate order for multiple TCP packets
    - sequence number increases by the number of bytes sent.
    - acknowledgment number: number of bytes received
- UDP: user datagram protocol
  - connection-less
  - data is sent and _hopefully_ received
    - faster, but doesn't guarantee completeness
  - http/3 uses QUIC, multiplexed transport protocol built on UDP

### IPv4

- 4 numbers (0-255) with `.` delimiter
  - 4 bytes or octets
  - 32-bit number
- `255.255.255.0` represents `11111111 11111111 11111111 00000000`

### ARP

- Address Resolution Protocol (ARP)
- procedure for mapping dynamic IP address to permanent physical machine address
  - map dynamic IP to physical address (MAC) in a local area network (LAN)
  - get the MAC address from an IP address

### Subnet mask

- subnet
  - range of IP addresses

- subnet mask
  - 4 octet number (32-bit)
    - 255 (all 1s): network
    - 0 (all 0s): host
  - 255.255.255.0 (/24)
    - 24 network-determined
    - 8 host-determined

- where to send data
  - A computer needs these to know where to send data:
    - IP address
    - subnet mask
    - default gateway
  - local
    - all devices in the same subnet can communicate directly (no router)
    - same subnet: look at subnet mask, determine if IPs match on that mask
  - not local
    - not in LAN
    - must be sent out through the default gateway
    - default gateway will determine where to forward message

### Classful addressing

NOTE: no longer used, too inflexible

- IANA: Internet Assigned Numbers Authority
  - The organization that oversees global IP address allocation
  - They don't directly distribute IP addresses
    - They give chunks to RIR (regional internet registries)
    - AfriNIC, APNIC (Asia-Pacific), ARIN (American), LACNIC (Latin A), RIPE NCC
    - RIRs don't distribute directly, they give chunks to ISPs

- classes
  - class A:
    - 0 - 126
    - /8
    - ~16.7 million IP addresses
    - 255.0.0.0
  - class B:
    - 128 - 191
    - /16
    - ~65.5k IP addresses
    - 255.255.0.0
  - class C:
    - 192 - 223
    - /24
    - 256 addresses (254 usable)
    - 255.255.255.0

NOTE: /16 (slash 16) (whack 16)

### Classless addressing

- CIDR: classless inter-domain routing
  - not limited to /8, /16, /24 subnets
  - each additional bit subdivides the subnet by 2
    - ie: splits the address count in half

- CIDR examples:
  - /24, 255.255.255.0, 256 addresses (254 usable)
  - /25, 255.255.255.128, 128 addresses (126 usable)
  - /26, 255.255.255.192, 64 addresses (62 usable)
  - /27, 255.255.255.224, 32 addresses (30 usable)

- motivation:
  - classful
    - A company needing 300 addresses
    - Too big for class C
    - Gets class B
    - Wastes 65k/65.5k (99%) of addresses
  - classless (with CIDR)
    - gets /23 network
    - greatly reduces IP address waste

### Dynamic and static IP addresses

#### DHCP Process

simple:

- DHCP discover
- DHCP offer
- DHCP request
- DHCP acknowledge

detailed:

- on boot, a computer doesn't have an IP address
- it will send out a DHCP discover
  - broadcast to all on LAN, looking for a DHCP server
- DHCP server will send a DHCP offer back
  - unicast traffic: DHCP server will know computer's MAC address
  - includes IP address, subnet mask, and default gateway
- computer sends DHCP request
- DHCP server sends DHCP acknowledge

#### DHCP server

- DHCP server keeps track of clients.
- Should have only one DHCP server
- It should be on the same LAN
  - DHCP Relay can be used to forward DHCP requests to another IP address
- DHCP lease duration can be set
- APIPA is built into DHCP clients, for when DHCP server can't be found
  - automatic private ip addressing
  - IP addresses look like 169.254.x.x (/16)
- if getting an IP addr other than correct network ID, maybe rogue DHCP server

### Special IP addresses

- Private IP addresses:
  - 10.x.x.x (prefix)
  - 172.16.x.x - 172.31.x.x (range)
  - 192.168.x.x (prefix)
    - NAT device hides you from the big, bad internet
- Loopback address(es):
  - 127.0.0.1
  - 127.x.x.x (prefix)
- APIPA addresses
  - 169.254.x.x (prefix)
    - DHCP server not found

### Address scenarios

- duplicate IP address
  - multiple DCHP servers, accidental collision
  - conflicting static addresses
- duplicate MAC address
  - network cards come with unique MAC addresses
  - this issue can arise with VMs
    - hard to cause
    - really hard to detect
- incorrect gateway
  - can't get data outside the network
  - can still share within LAN
  - man-in-the-middle attacks involve a separate default gateway
- incorrect subnet mask
  - all computers in the same broadcast domain will have the same subnet mask
  - wrong subnet will conditionally affect traffic
  - if two computers on same LAN have 1-way communication
    - one of them likely has the wrong subnet
- expired IP address
  - lease generation: computer goes through DHCP process, gets IP lease
  - lease renewal: computer asks DHCP server to keep lease (half way to expiry?)
  - if DHCP server goes down, lease is expired. Eventually APIPA (169.254.x.x)

## Routing

### Router

- Routers
  - are a box that connects network IDs
  - Routers filter/forward traffic based on IP address
    - gateway to a network
    - forward data packets to destination addresses
- Routing tables
  - A table that stores location of routers (based on their IP addresses)
  - Router uses routing table to forward traffic to the correct interface
    - contents
      - address (network ID/destination): IP address of destination
      - subnet (netmask): used to map destination address to the right network
      - gateway (next hop): next IP address to which the packet is forwarded
      - interface: outgoing interface that accepts to the destination
      - metric: rating (lower is better) used to determine optimal path
  - default route
    - fallback route on routing table (address 0.0.0.0 with best metric)
    - usually pointed to the upstream router (eg: ISP)

- Switches filter/forward traffic based on MAC address

#### SOHO Router

- default port: 192.168.0.1 or 192.168.1.1 (usually)
- default username/password listed in manual
- router portal: configure router, WAP, access, firewall, etc
- factory reset: 30/30/30 (hold reset: on/plugged in, unplugged, on/plugged in)
- usually a DHCP server by default
- Most home "routers" also double as a modem/switch/WAP/etc
  - They will often have only two connections: LAN and WAN. (gateway router)

#### Enterprise Router

- is only a router (other devices used for WAP, firewall, switch, etc)
- bandwidth is ~100x of a SOHO router
- tend to not have web GUI like SOHO router
- to be good at using Cisco routers, get Cisco CCNA/CCNP certs

### Ports

- tcp packets use addr/port to communicate
- well known ports: 0 - 1023
  - http server will usually use 80 or 443
- client will randomly use ports between 1024 and 65535

#### NAT

- NAT: network address translation
  - private IP address is translated to public IP address
- NAT-ed router will:
  - on outgoing:
    - replace private IP address with router's IP
    - write in routing table where the response should go
  - on incoming:
    - checks routing table
    - forwards data to correct (private) address
- Static NAT (port forwarding)
  - device consistently uses same address
- Dynamic NAT
  - Pooled NAT, limited number of IP addresses shared by devices on LAN

#### Port forwarding

- Firewalls will often block traffic that was not initiated from the inside
- port forwarding: used to allow for unsolicited incoming traffic
- range port forwarding: set up multiple ports
- port triggering:
  - if outgoing on certain ports, allow incoming on certain ports
  - eg: ftp client uses port 21, ftp server responds on 20
- DMZ (SOHO): allow all unsolicited traffic to be forwarded to a certain address

### Static vs dynamic routes

- static route: manually configured and persistent

- dynamic route:
  - networking technique that provides optimal data routing (best path)
  - dynamic routing allows routers to adjust their route tables
  - this brings all routers back to convergence
    - convergence: all router tables reflect all routes

- metric
  - which route is preferable?
  - MTU: maximum transmission unit
    - in a particular frame, how much data can you hold?
    - ethernet frame is 1500 B, but not all paths use ethernet
  - bandwidth
  - cost
  - latency

#### Dynamic routing

- dynamic routing protocols
  - methods for achieving convergence
    - distance vector
      - routing decisions (best path) are made based on distance (usually hops)
        - DV protocols send entire RTs to directly-connected neighbors
          - updates on regular interval (if unit goes down, diverged until next)
        - eg: RIP (v1 and v2), IGRP
    - link-state
      - shortest-path-first protocols
        - complete picture of network topology
        - Three tables: neighbors, topology of entire internet, actual RT
      - uses advertising for a much faster re-convergence process
      - examples: OSPF, IS-IS

- AS: autonomous system
  - one organization that has control of their own particular routers

- routing protocols can be broken up into two groups:
  - IGP: interior gateway protocols
  - EGP: exterior gateway protocols

#### Dynamic routing protocol examples

- IGP:
  - RIP (v2): routing information protocol
    - distance vector
    - fixed interval of updating RTs
      - will take a while to reach convergence
    - uses hop count to determine best path
    - RIPv2 can handle CIDR-based network, unlike v1 (only classful)
    - 15 hop limit
  - OSPF: open shortest path first
    - link-state
    - most used IGF protocol
    - LSR algorithm
    - painful to set up
    - how it works
      - routers in area share an area id
      - designated router and backup designated router
      - link state advertisements
    - converges very quickly (faster than RIP)
  - IS-IS: intermediate system to intermediate system
    - link-state
  - EIGRP: enhanced interior gateway routing protocol
    - distance vector
- EGP
  - BGP: border gateway protocol
  - path-vector (hybrid with aspects from distance-vector and link-state)
  - primary protocol (and cornerstone) of the internet
    - it's how the the internet, a huge/incredible network, is connected
  - EGP used to communicate between autonomous systems
  - ASN: autonomous system number
    - 32-bit number, looks like (but is unrelated to) IP address
    - each AS has an ASN that identifies it
      - internet has ~20k ASes
    - used when data is moving from one AS to another
      - eg: one big ISP needs to route data to another big ISP
      - interconnection facilities:
        - so ISP can share traffic to achieve complete interconnection

## TCP/IP applications

- tools
  - wireshark: TODO
  - netstat: TODO
- application
  - webservers: TODO
  - FTP: TODO
  - email (and securing email): TODO
  - Telnet and SSH

### TCP & UDP

- TCP & UDP work at transport layer (OSI)

- PDU: protocol data units
  - info used by the different protocols provided in frame segments

- ethernet frame
  - dst/src mac, dst/src ip, dst/src port, sequence, ack, data, fcs
- IP packet
  - dst/src ip, dst/src port, sequence, ack, data
- TCP segment & UDP datagrame
  - dst/src port, sequence, ack, data

- UDP: connectionless
- TCP: connection oriented
  - 2-way communication
  - initiated by 3-way handshake
    - process
      - client sends SYN packet
      - server responsds with SYN/ACK
      - client sends ACK
    - result
      - connection is opened
      - remains open until disconnect or timeout

### ICMP & IGMP

- ICMP & IGMP work at network layer (OSI) or internet layer (TCP/IP)

- ICMP: Internet Control Message Protocol
  - packet: type and checksum
  - eg: ping, ARP
- IGMP: Internet Group Management Protocol
  - packet: type, checksum, group addr, src addr
  - provides multicasting support
    - multicast IP addr: 224.x.x.x
    - one source, many subscribed to multicast IP addr (?)

### FTP

- FTP: file transfer protocol
  - ports 20, 21

### SMTP

- SMTP: simple mail transfer protocol
  - port 25
  - sending email
- POP3: post office protocol v3
  - port 110
  - receiving email
  - downloads email from server to single computer, then deletes on server
- IMAP: internet message access protocol v4
  - port 143
  - receiving email
  - stores message on server, synchronizes message across multiple devices

### Telnet and SSH

- manage and access devices remotely

- telnet:
  - port 23
  - uses plain text
- SSH:
  - port 22
  - encrypted data over secure channel
  - putty: popular ssh program

## DNS

### FQDN

- DNS: domain name service
  - resolve IP addrs based on a FQDN
  - FQDN: fully qualified domain name

Example: mobile.twitter.com/home

- DNS root zone
  - eg: "."
  - generally implied, omitted in most applications
- top-level domain (TLD)
  - eg: ".com"
- second-level domain (SLD)
  - eg: "twitter"
- subdomain
  - eg: "mobile"
- path, query params, fragment

### DNS Server

- DNS: resolving (mapping) FQDNs to IP addrs
- DNS server responds to DNS queries
- how it works
  - DNS recursor (resolver) receives query from DNS client
  - it interacts with other DNS servers to hunt down the correct IP addr
    - server makes client requests to 3 other types of servers
    - root DNS server, TLD nameserver, authoritative nameserver
  - DNS recursor returns the IP address of the origin server to DNS client
- caching
  - DNS recursors often cache the result for a limited time.
  - TTL for a DNS record is often 24-48 hours
- redundancy
  - ISPs will often have backup recursive resolvers
  - root DNS servers and TLD nameservers have multiple instances
- third-party
  - google: 8.8.8.8
  - cloudflare: 1.1.1.1

### Dynamic DNS

- DDNS: give stable domain name to dynamic IP address (eg: DHCP-provided)
  - ISPs can/will change IP addrs for your local network
  - DDNS provider will update IP info

### Hosts file

- hosts file takes precedence over DNS
- text file with mappings of ip addr to domain

## Securing TCP/IP

- CIA of security: confidentiality, integrity, availability

- encryption
  - obfuscate data (cleartext -> ciphertext) with an algorithm and key
  - symmetric encryption
    - same key to encrypt/decrypt
    - eg: AES, RC4
  - asymmetric encryption
    - different keys to encrypt/decrypt
      - public: to encrypt
      - private: to decrypt
    - eg: RSA (Rivest-Shamir-Adleman)
    - for two people to communicate, they must exchange public keys

- certificates and trust
  - digital signature used to show relation between public/private keys
  - third-party certificate authority used to establish trust
    - certificates include public key and >1 digital signature
  - PKI: public key infrastructure
    - uses hierarchical structure with root servers
  - errors
    - expired cert
    - self-signed cert
  - technologies to check validity of cert
    - CRL
    - OCSP

- hash algorithm
  - creates a fixed-size hash value
  - great way to verify that data hasn't been changed
  - eg (secure): sha2-256, sha3-256
    - high security level, low collision level
  - eg (cryptographically broken): sha1, md5

- auth:
  - identification & authentication
    - are they who they say they are
  - authorization
    - do they have permission to do something

- authentication factors
  - something you know (eg: password, pin, captcha, security questions)
  - something you have (eg: smart card, cryptographic id device)
  - something you are (eg: fingerprint, face)
  - something you do (eg: speed of typing)
  - somewhere you are (eg: detecting credit card fraud by location)

- federated trust:
  - trust established within a federation enables sharing/trusting of info
  - federation: independent but mutually-trusting realms
  - eg: Azure AD auth (SSO, federated systems)

- MFA: multi-factor auth
  - requires multiple auth factors

- ACL: access control list
  - three types:
    - MAC: mandatory access control
      - labels
    - DAC: discretionary access control
      - creators have control over permissions
    - RBAC: role-based access control
      - users -> groups -> rights/permissions

- AAA: authentication, authorization, accounting
  - radius
    - radius supplicant, client, and server
    - uses udp ports 1812,1813 or 1645,1646
    - radius database may reside outside radius server
  - TACACS+: cisco proprietary AAA product
    - tacacs+ user, client, server
    - tcp port 49

- PPP: point-to-point protocol
  - one-to-one connection
  - data link (OSI layer 2)
- PPPoE
  - one-to-many connections

- kerberos:
  - designed to do authentication for LANs
  - MSFT proprietary tech (requires windows server)
  - kerberos key distribution center
    - set up windows server to be domain controller
    - 2 services
      - AS: authentication service
      - TGS: ticket-granting service
    - client sends hash with values username/pw
    - server returns TGT token (ticket-granting ticket)
      - TGT issues tokens based on timestamp
      - 8 hours is common
  - designed for wired networks
  - timestamp logic requires that all computers use same time
- EAP: extensible authentication protocol
  - flexible
  - provides extensibility for wireless/wired IEEE 802.1X and PPP
  - framework that allows networking vendors to install new auth methods
    - EAP methods
  - eg: EAP-PSK, PEAP, EAP-TLS (and TTLS)

- SSO
  - Windows active directory
    - for windows domain networks (LAN)
  - SAML: security assertion markup language
    - SSO across sites using SAML identity provider

## Advanced networking devices

### IP Tunneling

- tunneling:
  - providing encryption for a service that normally isn't encrypted
  - many internet protocols are unencrypted

- VPN: virtual private network
  - tunnel connection for remote computers to get to a designated endpoint
  - multiple types: PPTP, L2TP/IPsec, SSTP, IKEv2
  - client-to-site VPN connects remote computer to a local network
  - site-to-site VPN connects distant networks into a single network.

- VLAN: virtual LAN
  - takes a broadcast domain and splits into two or more domains
    - using software to split a LAN, rather than physical reorganization
  - requires a managed switch
    - unmanaged switches have are cheaper but have less features
    - managed switches have IP addresses for conn/config
      - VLAN & managed switch require configuration setup
    - trunking allows propogation of a VLAN across multiple switches
    - Cisco
      - managed switches have CNA (cisco network assistant)
      - VTP: VLAN trunk protocol
        - one switch notifies other switches of VLAN
        - trunk ports move traffic from all VLANs between switches
          - dynamic desireable
  - InterVLAN routing
    - allowing VLANs to communicate with each other
    - virtualization of router functionality (on higher-end sswitches)

### QoS

- QoS: Quality of Service
- traffic shaping: optimize/guarantee performance by delaying other kinds

### IDS

- firewall
  - allow/block traffic based on defined security rules
- IDS: intrusion detection system
  - detects intrusion, notifies
  - out-of-band (traffic does not go through IDS)
- IPS: intrusion prevention system
  - detects intrusion, takes action
  - actively stops or rejects
  - in-band (traffic goes through IPS)

### Proxy

- forward proxy server
  - obfuscates client
  - client -> proxy -> firewall -> internet -> firewall -> server
  - application-specific (eg: web, ftp, VoIP)
  - uses: caching, content filtering
- transparent proxy
- reverse proxy server
  - obfuscates server
  - client -> firewall -> internet -> firewall -> proxy -> server
  - uses: security, handle DoS attacks, load balancing, caching

### Load balancing

TODO

## IPv6

- IPv4 is 32-bit
  - limited to ~4.3 billion addresses
  - .58 billion reserved, 3.7 billion usable

- IPv6 is 128-bit
  - 3.4 * 10^38

- smallest subnet mask is /64
  - only subnet is /64, with the exception of VLSM
  - VLSM: variable-length subnet mask

- 8 segments (4 hex each), 7 colon delimiters
  - drop leading zeros in each segment
  - replace one group of all-zero segments with `::`

- IPv6 allows data to move much faster through the internet
  - aggregation
- NDP: neighbor discovery protocol
  - eliminates the need for NAT, ARP, and DHCP
  - how it works
    - discovery messages are ICMP v6
    - router discovery
      - router solicitation
        - request for router advertisement msg
      - router advertisement
        - IPv6 router message to advertise presense
        - inform other IPv6 devices about important IPv6 link params
          - eg: default gateway, network prefix, prefix length, MTU, etc
    - neighbor discovery
      - neighbor solicitation
        - sent by IPv6 device:
          - to resolve the link-layer (MAC) addr of a neighbor
          - to verify reachability of cached link-layer (MAC) addr
          - for DAD (duplicate address detection)
        - multicast, not broadcast
      - neighbor advertisement
        - response to solicitation
        - unsolicited msg to announce a change in link-layer (MAC) addr
    - redirect message
      - inform host of a better next hop

- 2 addresses
  - link local address
    - generated by IPv6-capable host on startup
  - internet address
    - given by gateway router

- link local address
  - 2 parts
    - first: fe80:0000:0000:0000
    - second:
      - EUI-64
        - mac address, split in half, with `ff-fe` in middle, flip 7th bit
      - randomizer
        - randomly generated 64-bit number

- DHCPv6
  - TODO

- temporary IPv6 addresses
  - for security reasons
  - apps sometimes request temporary IP addr
  - this is easily supported by IPv6 stateless auto configuration

### IPv4 and IPv6

- dual-stack: running both IPv4 and IPv6

- ISPs in general do not provide IPv6 to their customers
  - we can't do native IPv6
  - tunneling protocol required to get on IPv6 internet

## Remote connectivity

- telephone
- optical
- dial-up
  - telephone line
- DSL: digital subscriber line
  - telephone line
  - faster than dialup
- cable
  - tv line
  - faster than DSL
- satellite
  - modem -> dish -> satellite
  - for remote locations
  - lower bandwidth, higher latency
- ISDN
- BPL
