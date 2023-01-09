# Network

## IP

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

### Addressing

#### Subnet mask

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

#### Classful addressing

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

#### Classless addressing

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
