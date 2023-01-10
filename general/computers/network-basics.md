# Network

## IPv4

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
      - gateway (next hop): next IP address to which the packed is forwarded
      - interface: outgoing interface that accepts to the destination
      - metric: rating (lower is better) used to determine optimal path
  - default route
    - fallback route on routing table (address 0.0.0.0 with best metric)
    - usually pointed to the upstream router (eg: ISP)

- Misc
  - Switches filter/forward traffic based on MAC address
  - Most home "routers" also double as a modem/switch/WAP/etc
    - They will often have only two connections: LAN and WAN. (gateway router)

### Ports

- tcp packets use addr/port to communicate
- well known ports: 0 - 1023
  - http server will usually use 80 or 443
- client will randomly use ports between 1024 and 65535

### NAT

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
