# Security

## CIA of Security

Goals of Security:

- Confidentiality
  - Data is kept confidential
- Integrity
  - Data is not mutated by unauthorized entities
- Availability
  - Ensure systems/data are available to authorize users when needed

Further goals:

- Auditing/Accountability
  - Logging/tracking
- Non-Repudiation
  - Eliminate uncertainty around a user's action

## Risk management

- Risk Management
  - identification, assessement, and prioritization of risk

- Assets
  - Anything the business benefits from
- Vulnerabilities
  - Weakness that allows asset to be exploited
- Threats
  - discovered action that exploits a vulnerability's potential to harm an asset
- Threat agent
  - entity that initiates a threat
  - often a person
- Likelihood
  - level of certainty that something bad will happen
  - quantitative/qualitative
- Impact
  - harm caused by threat

- threats applied to vulnerability is risk
  - `threats -> vulnerability = risk`

- NIST: National Institute of Standard and Technologies
  - NIST SP 800-30
    - document with huge list of vulnerabilities/threats
    - good starting place for risk management

### Threat actors

- internal/external
- level of sophistication
  - accidental or intentional
- intent
  - why, what were they trying to do
- use of OSINT (open-source intelligence)

- advanced persistent threat (APT)
  - get in a system and stay there

- examples
  - script kiddies
    - trivial attack knowledge
    - using pre-built scripts/tools
    - easy to block with basic security practices
  - hacktivist
    - intent is motivation
  - organized crime
    - smart groups of people
    - motivation is money
  - nation state
    - intelligence, resources, sophisticated tools
    - motivation is often intelligence
  - insiders
    - employee, contractor, etc
  - competitors
    - unlikely, as laws are often deterrent

### Risk identification / assessment

Threats and vulnerabilities are often looked at together

#### Vulnerabilities

- Look through assets, determine associated vulnerabilities
- resources
  - NIST SP 800-30
  - cve.mitre.org
    - common vulnerabilities and exposure database
    - massive database, lots of vulnerability details
  - nessus
    - program run on LAN to generate vulnerability report
  - pen testing
    - a service for vulnerability assessment

#### Threats

- adversarial
  - intentionally doing bad things
  - eg: hacker, malware
- accidental
  - someone has rights/permissions and accidentally messes things up
- structural
  - equipment failure
  - eg: power goes out, camera stops working, etc
- environmental:
  - eg: fires, earthquakes, flooding, etc

### Risk response

- mitigation: doing something to reduce likelihood/impact of risk
- transference: offloading risk onto a third party
- acceptance: benefit is less significant than effort to address
- avoidance: don't do risky thing at all

### Risk framework

Two popular ones:

- NIST Risk Management Framework Special Publication 800-37
- ISACA risk IT Framework

### Security controls

- deterrent
  - deter threat
- preventative
  - prevent threat
- detective
  - recognize threat
- corrective
  - mitigate impact of manifested threat
- compensative
  - hacky or stop-gap solution to above control functions

### Defense

defense in depth: layered security

- redundancy: repeating the same controls
- diversity: using a variety of controls

- security control types
  - administrative
  - physical
  - technical

- control diversity: using (multiple) different types of security controls
- vendor diversity: implementing security controls from different vendors

### IT security governance

- IT security governance: influences how an ort conducts IT security

- laws and regulations
  - HIPAA
- standards
  - government standars (eg: NIST)
  - industry standards (eg: PCI-DSS)
- best practices
  - eg: microsoft best practices
- common sense

### Documents

- policies: document that defines how a group does something
- organizational standard: define the acceptable level of perf of a policy
- organizations might mix/combine the two

- acceptable use policy
  - what a person can/cannot do on company assets
- data sensitivity & classification policies
  - define importance/nature of data
- access control policies
  - define how to get access to data/resources
- password policy
  - strength of pw, recovery, repeated bad logins,
- care and use of equipment
  - maintenance, stewardship, etc
- privacy
  - what will be done with private stuff (both internal and external)
- personnel policy
  - background checks, clearances, mandatory vactions, job rotation

### Frameworks

Framework sources:

- regulatory
- non-regulatory
- national standards
- international standards
- industry-specific

Popular frameworks:

- NIST SP800-37
  - national standard and regulatory
- ISACA IT infrastructure
  - non-regulatory
- ISO 27000
  - international

#### NIST

6 steps:

- categorize
  - categorize information systems
- select
  - select security controls
- implement
  - implement security controls
- assess
  - assess security controls
  - Due diligence: will it work how we want it to?
- authorize
  - authorize controls
- monitor
  - monitor control
  - is it performing as expected? any side-effects?

### Quantitative risk calculations

- asset value
  - cost of item, replacement service, lost revenue, etc
- exposure factor
  - what percentage of asset is lost by incident
- single loss expectancy (SLE)
  - asset_value * exposure_factor
- annualized rate of occurence (ARO)
  - in a year, what's the probability of a particular incident
- annualized loss expectancy (ALE)
  - SLE * ARO

- use mitigation, avoidance, etc to reduce ALE

- MTTR: mean time to repair
  - downtime between failure and working again
- MTTF: mean time to failure
  - uptime between working and (next) failure
  - usually applied to things that CANT be fixed
- MTBF: mean time betwen failure
  - time during one cycle of downtime & uptime
  - usually applied to something that can be repaired

#### BIA

- BIA: business impact analysis
  - Three steps:
  - determine mission processes and recovery criticality
  - identify resource requirements
  - identify recover priorities for system resources

- impact
  - property, people, finance, reputation

- PII: personally identifiable information

- metrics/assessment
  - PIA: privacy impact assessment
    - estimates the cost of loss of personal privacy or proprietary data
  - PTA: privacy threshold assessment
  - RTO: recovery time objective
    - min time to restore critical systems
    - max downtime allowed without substantial impact
  - RPO: recovery point objective
    - max data that can be lost without substantial impact

### Organizing Data

- data types:
  - public: no restrictions
  - confidential: limited to authorized viewing as agreed by parties involved
  - private: limited to only the individual to whom the info is shared
    - PII: personaly identifiable information
  - proprietary: private at corporate level
  - PHI: protected health information

- data roles:
  - owner: legally responsible for the data
  - steward/custodian: maintain accuracy/integrity of data
  - privacy officer: ensures data adheres to privacy policies/procedures

- data user roles:
  - users: assigned standard permissions to complete a task
  - privileged user: increased access/control relative to a user
  - executive user: set policies on data and incident response actions

- system administrators: complete control over data/system
- data/system owner: legal ownership/responsibility of data/system

### Onboarding and offboarding

- onboarding
  - background check
  - NDA: non-disclosure agreement
  - standard operating procedures
  - specialized issues
  - rules of behavior
- offboarding
  - disable accounts
  - return credentials
  - exit interview (
    - knowledge transfer

### PII

- NIST 800-122 (guide to protecting confidentiality of PII)
- examples:
  - full name
  - home addr
  - email addr
  - national id number
  - passport number
  - vehicle registration plate number
  - driver's license number
  - face, fingerprints, handwriting
  - credit card numbers
  - digital identity
  - date of birth

### Role based data controls

- personnel management controls
  - mandatory vacations
  - job rotation
  - separation of duties
  - multi-person control

- role-based data controls
  - system owner:
    - management-level role
    - maintains security of system
    - defines system administrator
    - works with all data owners to ensure data security
  - system admin:
    - day-to-day administration of a system
    - implement security controls
  - data owner
    - defines sensitivity of data
    - defines protection of data
    - works with system owner to protect data
    - defines access
  - user
    - accesses and uses assigned data responsibly
    - monitors and reports security breaches
  - privileged user
    - special access beyond the typical user
    - works with system admin to ensure data security
  - executive user
    - read-only access to all business data

### Third-party agreements

- private sector
  - BPA: business-partnership agreement
    - primary entities
    - timeframe
    - financial details
    - management
  - SLA: service-level agreement (agreement between service provider and client)
    - service to be provided
    - minimum uptime
    - response time
    - start/end dates
- public sector
  - ISA interconnection security agreement (name comes from NIST 800-47)
    - statement of requirements
      - why the connection?
      - who is connecting?
    - system-security considerations
      - what info?
      - where is the info going?
      - what services are involved?
      - what encryption is needed?
    - topological drawing
      - technical diagram that shows connection details
    - signature authority
      - reinforced with MOU/MOA (Memorandum of Understanding/Agreement)
        - purpose of connection
        - relevant authorities
        - specify responsiblities
        - terms of agreement
        - termination and reauthorization

## Cryptography

- cryptography:
  - the science of writing or solving codes
  - techniques for securing communication (via obfuscation)
    - _only_ the sender and intended recipient can view contents

- encryption: obfuscate data (cleartext -> ciphertext) with an algorithm and key

- cryptosystem: computer system that employs cryptography
  - has defined process around:
    - key properties
    - communication requirements for key exchange
    - actions taken through encryption/decryption process

- 4 principles of cryptography
  - data confidentiality
  - data integrity
  - authentication
  - non-repudiation

- Kerchoff's principle: a cryptosystem should be secure, even if everything
  about the system, except the key, is public knowledge

- targets
  - data at rest
  - data in transit
  - data in process

- block cipher: deterministic algorithm operating on fixed-length bit groups

### Cryptography methods

- symmetric encryption: one key encrypts and decrypts
  - primary way of encrypting data
  - by itself, not good for encrypting communications between entities
    - needs asymmetric encryption for session key exchange
    - otherwise, an intercepting third party could get key (full access)

- session key: a single-use encrypt/decrypt key for a communication session
  - ephemeral key: has perfect forward secrecy
  - perfect forward secrecy: knowledge of prev key won't compromise curr key

- asymmetric encryption
  - different keys to encrypt/decrypt
    - public: to encrypt (sent to other entity)
    - private: to decrypt
  - eg: RSA (Rivest-Shamir-Adleman)
  - for two people to communicate, they must exchange public keys
  - certificate authority for trust

- ECB: electronic code book
  - symmetric encryption, no initialization vector or chaining
  - identical cleartext and key will yield same ciphertext.
  - deprecated
    - attackers can observe patterns
- CBC: cipher block chaining
  - initialization vector: block of bits, same size as block
  - used for XOR against block
  - encrypt
  - store result
  - result used as initialization vector for next block (chaining)
- CFB: cipher feeedback
  - encrypt initialization vector
  - XOR IV to block
  - encrypt
  - store result and use as IV for next block
- CTR: counter
  - IV: NONCE value (single-use arbitrary num) + counter (incrementing binary)
  - XOR against block
  - store result
  - increment counter for next block iteration

### Symmetric algorithm

- history
  - DES: data encryption standard
    - symmetric block encryption
    - 64-bit block, 16 rounds, 56-bit key
    - issue: short key
  - blowfish
    - symmetric block encryption
    - 64-bit block, 16 rounds, 32- to 448-bit key
  - TDES
    - symmetric block encryption
    - 64-bit block, 16 rounds, 3 56-bit keys (encrypt, decrypt, encrypt)
  - AES: advanced encryption standard
    - Rijndael algorithm
    - symmetric block encryption
    - 128-bit block, x rounds, 128-/192-/256-bit key
  - RC4:
    - streaming encryption
    - 1 bit at a time (as it comes in)
    - 1 round, 40- to 2048-bit key

### Asymmetric algorithms

- Diffie-Hellman
  - key agreement (key exchange) protocol
  - enables two parties to come up with the same session key
    - shared secret key over insecure channel
  - process
    - common paint
    - secret colors
    - mix and trade
      - mixture separation should be expensive
    - add secret color again
    - result is common secret (common + secret1 + secret2)
  - DH groups: specifications for size/type of key structure
  - crackable by well-funded attackers

- RSA: Rivest–Shamir–Adleman
  - 256/512/1024/2048/etc bit keys

- ECC: elliptic curve cryptography
  - elliptic curve formula used to create robust key pair quickly
  - smaller keys than RSA
  - faster key generation than RSA (arguably)

#### Trust and certificates

- You might (not) be talking to the intended party
- digital signature
  - signing algorithm(message, private key) -> signature
  - signature-verifying algorithm(public key, signature, message) -> verified
- Third-party certificate authorities are used to establish trust
- certificate contains public key, digital signature, and CA digital signature
  - self-signed won't have CA signature

#### PKI

- CA: certificate authority
- PKI: public key infrastructure
  - hierarchy: CA -> intermediate CA -> me
    - root certificate at top of structure
    - root certificate system -> designated intermediary CA
  - standards
    - no unified standard
    - PKCS: public-key cryptography standards
      - invented by RSA Corporation
      - PKCS-7 is a way to store certs as individual files
      - PKCS-12 stores certificates and private keys as a package
  - CRL: certificate revocation list
    - browsers can check CRL to check for revoked certificates
    - CDP: CRL distribution points
      - web server where a CA publishes CRLs
    - CRL might be lagged
  - OCSP: online certificate status protocol
    - similar to CRL but real-time

### PGP and GPG

- PGP: pretty good privacy
- GPG: GNU privacy guard

- PGP was originally for email encryption
- PGP and GPG are funcionally similar
  - PGP is not open-source (Symantic proprietary)
  - GPG is open-source, and is implemented
    - different implementations of OpenPGP standard
- use public key pair and random generated key

- encryption
  - generate random key
  - encrypt data
  - encrypt key using receiver's public key
  - send encrypted message
- decryption
  - receiver decrypts key and data

- PGP signing
  - signed by trusted third party for trust
  - services
    - Symantec
    - OpenPGP

### Hashing

- hashing: transforming input data into another value algorithmically
  - output is usually fixed-length
  - process is one-way, deterministic

- hash types
  - md5: message digest 5
    - 128 bit hash
    - broken, collisions
  - SHA1: secure hash algorithm
    - family of hash algorithms
    - developed by NIS
    - 160-bit hashes
    - broken, collisions
  - SHA2
    - eg: SHA-256, SHA-512
    - lower level of collisions
  - RIPEMD
    - 128, 160, 256
    - not as popular as SHA2

- HMAC: hashbased message authentication code
  - used to verify integrity of data and authenticity of message
    - hash involves data and shared key
    - only the intended party should have access to the shared key
  - composition
    - cryptographic key and encryption algorithm
    - hash function

### Steganography

- Hiding data within data
- Commonly done by encoding data into images

### Cryptographic attacks

- passwords storage
  - not stored as plain text
  - usually hashed

- crytographic attacks
  - typically attempts to hack hashes
    - can't reverse a hash
    - hashing attacks are comparative attacks
    - generating hashes and comparing to stored hashes
    - complex passwords make cryptographic attacks harder
  - have to get access to list of hashes
  - types
    - brute force
    - dictionary
    - rainbow table
  - salt
    - arbitrary, fixed value
    - added to a password before hashing
    - salted hashes are harder to crack
  - key stretching
    - insert a random set of chars to increase the size of the password hash
    - algorithms
      - bcrypt
      - PBKDF2

## Identity and access management

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

- authorization
  - permissions
    - applied to resources
  - rights and privileges
    - assigned at system level
  - strategies
    - least privilege
    - separation of duty

- access control
  - ACL: access control list
    - access is defined by ACL
    - implicit deny: denied unless explicitly permitted
  - three strategies:
    - MAC: mandatory access control
      - labels
    - DAC: discretionary access control
      - creators have control over permissions
    - RBAC: role-based access control
      - users -> groups -> rights/permissions

- password security
  - password security policy
    - complexity, expiration, history

- linux file permissions
  - creator/owner, group, other
  - rwx: read, write, execute
    - read: view contents of file or directory
    - write: modify contents of file or directory
    - execute: execute a file, cd into directory
  - chmod to change permissions
  - chown to change ownership
  - passwd to change password

- user access management
  - monitor and log user account activity
    - login/logoff, db/file access, etc
  - shared accounts are bad
  - least-privilege permissions
  - use dedicated service accounts (not default accounts)

- AAA
  - AAA: Authentication, Authorization, Accounting
  - TODO: RADIUS, TACACS+
  - Authentication
    - Authentication methods
      - PAP, CHAP, NTLM, Kerberos
      - SAML, LDAP
    - SSO
      - Federated system
      - LAN: Windows Active Directory
      - SAML

- network tools
  - ping, ipconfig, netstat, ip, nslookup
  - network scanners: nmap, zenmap (gui),
  - protocol analyzers (sniffer/analyzer): wireshark, tcpdump

- logging
  - non-network events
    - OS events (host startup/shutdown/reboot, service start/stop, OS update)
    - application events (app start/stop/crash)
    - security (logons)
  - network events
    - OS/system level
    - app level

## Securing individual systems

- Attacks
  - DOS
    - Types
      - Volume (eg: PING)
      - Protocol (eg: SYN)
      - Application (eg: Slowloris)
    - DDOS: Distributed DOS
  - Host threats
    - Spam (email)
    - Phishing (email)
    - Spim (messenger)
    - Vishing (voice)
    - Clickjacking
    - Typo squatting
    - Domain hijacking
    - Privilege escalation
  - Man-in-the-middle
    - ARP poisoning
    - DNS spoofing
    - wifi eavesdropping
    - downgrade attack
    - session hijacking

- Resilience
  - Scalability
  - Elasticity
  - Redundancy
    - distributed allocation
  - non-persistence (ie: snapshots)
    - known state
    - rollback

- Physical Hardening
  - Removable media controls (with policies)
    - Eg: Configure optical media permissions
  - DEP (Data Execution Prevention)
    - Is almost always a good idea
  - Port disabling
    - Can be done in BIOS

- Protecting electronic equipment
  - RFI: Radio frequency interference
  - EMI: Electromagnetic interference
  - ESD: Electrostatic discharge

- Host hardening
  - Disabling unnecessary services
  - Change default passwords
  - Disable unnecessary user accounts/groups
  - Patch management
    - monitor, test, evaluate, deploy patch, document
  - Anti-malware
    - user training, procedures (best practices), monitoring
    - IDS: Intrusion detection systems
    - third-party anti-malware tools
  - Host firewalls
    - firewalls typically work at application level

- Data and System Security
  - Data integrity
  - Speed (of access)
  - High availability
    - Clustering
    - Load Balancing
    - Virtualizing servers

- Disk Encryption
  - TPM

- Hardware/Firmware security
  - FDE: Full disk encryption
  - Secure boot

- Peripherals
  - Bluetooth is not very secure
  - Vulnerability via USB/SD/etc connections
    - Hidden Wifi (eg: WAP from SD device with NIC)
    - USB (eg: physical access via rubber duck)
  - Turn off unnecessary ports
  - Patch devices (updates)

- Malware
  - Virus
  - Adware
  - Spyware
  - Trojan
    - RAT: Remote-access trojan
  - Ransomeware (crypto-malware)
  - Logic bmob (triggered event)
  - Rootkit (escalates privileges to execute something)
  - Backdoor (intentional/undocumented way of gaining access to a system)
  - Polymorphic malware
  - Armored virus
  - Keylogger

- Network security
  - IDS: Intrusion detection systems
    - detect and report possible attacks
  - IPS: Intrusion prevention system
    - run inline with network and act on (stop) detected attacks
  - A firewall filters, IDS notifies, IPS acts to stop

- Data destruction
  - This is not limited to hard drives (eg: physical documents)
  - Methods
    - wiping
    - purging
    - destroying
    - shredding/pulverizing

## LAN

- Switches filter and forward by MAC address
- Routers filter by IP address
- Network Firewalls are used on a gateway router for protection

- VLAN
  - VLAN provides layer 2 separation of networks
  - physical device that designates separate broadcast domains
- STP: Spanning tree protocol

- Network topology
  - LAN, WAN, etc
  - TCP/IP

- Airgap: a separation of networks

- Auth protocols
  - PPP, CHAP, EAP, Radius, LEAP, EAP-Fast, PEAP
  - EAP is frequently used in network/internet connections
    - EAP-MD5, EAP-PSK, etc

- Network firewall
  - Filtering strategies
    - Stateless
    - Stateful
  - ACL: Access control list

- Proxies
  - forward proxy: hides client
  - reverse proxy: hides server

- Honeypot
  - emulate web server, used to deter threat actors and collect information
  - honeynet emultes a full network

- VPN: Virtual private network
  - For connecting to a remote network securely
  - VPN Tunnel: connection betweeen VPN endpoints
  - Types
    - Remote Access
    - Site-to-site VPN: connecting multiple networks
  - full vs split tunnel
    - VPN for all traffic or partial traffic
  - Setup
    - Protocol to set up tunnel
    - Protocol to handle auth/encryption
  - VPN protocols
    - PPTP, L2TP, IPsec, SSL/TLS, OpenVPN

- IPsec
  - TODO

- Wireguard
  - slighty faster, much simpler than IPsec

- NIDS: Network intrusion detection system
- NIPS: Network intrusion prevention system
  - inline, active response, can alter the flow of network traffic

- SIEM: Security information and event management
  - SIEM tools aggregate/correlate data
  - organize to get the time sequence of an event across logs quickly
  - configurable notification triggers

- Open Networks
  - Dangerous, because they are insecure
  - Use https
  - Use VPN

- WAP Vulnerabilities
  - Unauthorized access point
    - Rogue access point
      - a UAP that is connected to a secure network
      - Accidental
      - Eg: plugging a SOHO router WAP into a wired network
    - Evil twin
      - MITM attack method
      - Intentional
      - Process
        - Jam regular channel (with wireless jammer)
        - People accidentally connect to evil twin on different channel
        - Wireshark to sniff packets

- Cracking 802.11
  - WEP: Wired equivalent privacy
    - oldest and least secure of WEP/WPA/WPA2
    - still used by way too many people (5-15% of networks)
    - can crack by mathematically deriving from packets
  - WPA: Wi-fi protected access
    - protocol
      - WPA uses TKIP
      - WPA2 uses AES encryption
    - vulnerable to dictionary attack
      - people typically use weak passwords
    - 4-way handshake
      - has flaw, resulting in vulnerability at initial connection
  - WPS: Wi-fi protected setup
    - connecting WAP and WPS-capable device with WPS button
    - easily crackable
      - don't use it, don't get a router that has WPS
    - some modern routers added features to make WPS safer

- Hardening Wireless
  - TODO

- WAP: Wireless access point
  - TODO

- Virtualization
  - TODO

## Secure Protocols

- OSI Model (7 layers)
- TCP/IP Model (4 layers)

- IPv4 (32 bit) vs IPv6 (128-bit)

- Transport protocols
  - TCP
    - Connection oriented
    - 3-way handshake
  - UDP
    - Connectionless
  - ICMP
    - eg: ARP, ping
    - single packet

- Protocols and port numbers
  - TODO

- SSL/TLS
  - Establishes secure link
  - Originally designed for secure websites
  - 4 main aspects of secure connection
    - encryption, key exchange, authentication, HMAC
  - Internet service hardening
    - use secure protocols (SSH over telnet, SFTP/FTPS over FTP, etc)

- Secure development/deployemnt operations
  - Security automation tools
  - Baselining
    - Critical security objectives
      - Encryption
      - Input validation
  - Consider immutable systems
  - Infrastructure as code
  - Proper error handling
  - Data normalization
  - Obfuscation
  - Maintained code (DRY, no dead code, etc)
  - Memory management
  - Vetting 3rd party deps

- Code quality and testing
  - static code analysis
  - dynamic code analysis (unit, integration, system, performance testing)
  - staging (testing in a close-to-reality, sandboxed environment)
  - model verification

## Testing your infrastructure

- Network tools
  - Nmap (and Zenmap)
  - MSFT Baseline Security Analyzer
  - Tracenet
  - Advanced IP scanner

- Vulnerability assessment
  - Tools for simple networks
    - Nessus
    - Nexpose
    - OpenVAS
  - Many tools use National Vulnerability Database (NVD) as a source
  - Process
    - Get authorization
    - Typically non-intrusive
    - Identify vulnerabilities
    - Check for common misconfigurations
    - Try to reduce false positives
    - Ensure compliance

- Social Engineering
  - Boils down to people tricking people
  - Principles
    - Authority: impersonating someone in a position of authority
    - Urgency
    - Familiarity
    - Intimidation
    - Consensus: To convince of a general group agreement
    - Scarcity
    - Trust
  - Attacks
    - Typically fall into two categories
      - Physical attacks
        - Unauthorized access (unlocked computer while AFK)
        - Shoulder surfing
        - Tailgating
        - Dumpster diving
      - Virtual attacks
        - Phishing
          - Spear Phishing
          - Whaling (targets senior/executive roles)
        - Vishing
        - Hoax
        - Watering hole attack

- Common Log Format (CLF)
  - Ident, Authuser, date/time, req (method, path, protocol, status, bytes)

- Web attacks
  - Common website attacks
    - Cross-site scripting (XSS)
    - XML injection
  - Common app attacks
    - Injections (eg: code, command, sql, ldap injections)
    - Overflow (eg: buffer, integer overflow)

- Exploiting a target
  - Pen test
    - Get authorization
    - Determine attack model
      - white box (well-informed attacker)
      - black box (attacker has no prior knowledge)
      - gray box (attacker has some prior knowledge)
    - Discover vulnerabilities (recon)
      - Intelligence gathering: passive, semi-passive, active
    - Exploit vulnerabilities (get data)
      - Kali Linux (Metasploit framework, Armitage)
      - Terms
        - Pivot: use compromised system to attack other systems
        - Persistence: connect again easily
        - Privilege escalation

- Vulnerability impact
  - Embedded systems
  - Lack of vendor support
  - Configuration (weak configuration or misconfiguration)
  - Improperly configured account
  - Vulnerable business process
    - Storing non-essential info (PII)
  - Memory/buffer vulnerability
  - System sprawl

## Dealing with incidents

- NIST 800-61 Computer Security Incident Handling Guide

- Incident response process
  - Preparation
    - What might happen?
    - Who will respond (and in what way)?
  - Reporting
    - Which reports go to whom?
    - Escalation
  - Practice scenarios
  - Identification
    - Recognize incidents as they occur
    - Reports from users
    - Utilizing/checking monitoring tools
    - Watch alerts/logs
    - Assess impact
    - Define who's involved
  - Containment
    - Mitigate damage
    - Stop attack
    - Segregate network
    - Shut down a system
    - Turn off a service
  - Eradication
    - Remove malware
    - Address vulnerabilities
    - Add new controls
  - Recovery
    - Restore from backups
    - Pull from snapshots
    - Hire replacement personnel
    - Monitor to ensure good operations

- Incident response plan
  - CIRT: Cyber incident response team
    - A group of people who are responsible for incident response
    - IT security, IT department, HR, legal, public relations
    - document incident type/category definitions
      - physical access, malware, phishing, social engineering, data access, etc
  - Roles and responsibilities
    - Submitting issues: users, help desk, HR, DB manager, incident hotline
  - Reporting requirements & escalation
    - Determine severity
    - Clear chain of escalation (severity-based)
    - Informing law enforcement
  - Practice (scenarios/drills)
  - Post-incident documenting

- Digital Forensics
  - Process of gathering data to be presented in a formal inquiry (eg: in court)
  - Causes:
    - Incident occurence
    - Legal hold
  - Chain of custody
    - Purpose
      - Gathering evidence
      - Data must have high integrity
    - Process
      - Define the evidence
      - Document the collection method
      - Date/time collected
      - People handling evidence
      - Function of person handling evidence
      - Location of evidence
    - Order of volatility
      - Memory
      - Disk
      - Backups
    - Data acquisition
      - tools for reading memory and disk
      - write block
      - capture system image
      - network traffic and logs
      - capture video
      - take hashes
      - take screenshots
      - interview witnesses
      - track man hours

- Contingency planning
  - Dealing with serious incidents
    - Disaster recovery
    - Business continuity
  - Evacuation plan
    - Backup site
      - Cold site: weeks to bring online (no equipment, no data)
      - Warm site: days to bring online (some equipment, no data)
      - Hot site: hours to bring online (equipment and data synced)
  - Order of restoration
    - Power
    - Wired LAN
    - ISP link
    - AD/DNS/DHCP servers
    - Servers and workstations
  - Failover
  - Alternative processing sites
  - Alternative business practices
  - After-action reports

- Backups
  - Types
    - Full (all files)
    - Differential (changes since last full)
    - Incremental (changes since last)
  - Snapshots (typically for VM)
  - Local, remote, cloud
