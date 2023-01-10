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

## Threat actors

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

## Risk identification / assessment

Threats and vulnerabilities are often looked at together

### Vulnerabilities

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

### Threats

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

## Risk response

- mitigation: doing something to reduce likelihood/impact of risk
- transference: offloading risk onto a third party
- acceptance: benefit is less significant than effort to address
- avoidance: don't do risky thing at all

## Risk framework

Two popular ones:

- NIST Risk Management Framework Special Publication 800-37
- ISACA risk IT Framework

## Security controls

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

### Interesting security controls

- principle of least privilege
- separation of duties
- multi-person control
- mandatory vacation
- job rotation

## Defense

defense in depth: layered security

- redundancy: repeating the same controls
- diversity: using a variety of controls

- security control types
  - administrative
  - physical
  - technical

- control diversity: using (multiple) different types of security controls
- vendor diversity: implementing security controls from different vendors

## IT security governance

- IT security governance: influences how an ort conducts IT security

- laws and regulations
  - HIPAA
- standards
  - government standars (eg: NIST)
  - industry standards (eg: PCI-DSS)
- best practices
  - eg: microsoft best practices
- common sense

## Documents

- policies: document that defines how a group does something
- organizational standard: define the acceptable level of perf of a policy
- organizations might mix/combine the two
