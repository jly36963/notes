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

## Frameworks

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

### NIST

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

## Quantitative risk calculations

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

### BIA

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

## Organizing Data
