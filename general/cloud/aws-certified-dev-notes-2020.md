# AWS

## Regions

- AWS is multi-region
  - Compiance: data governance and legal requirements
  - Proximity: deploy closer to users, less latency
  - Pricing & services available are region-dependent

## IAM

Features:

- Control of AWS account
- Shared access
- Granular permissions
  - Least privilege: give minimum permissions needed to function
- Secure access
  - MFA
  - Temporary access
  - Password policies
    - Length, contents, expiration, etc
  - Integrated
  - PCI DSS compliance
- Identities
  - Users
  - Groups
  - Roles (for services)
- Policies
  - A document that defines one or more permissions
  - Grants permissions to an entity
  - Inheritance
    - A user can inherit permissions from multiple (user/group) policies
- Access
  - Console (browser)
  - Programmatic (CLI/SDK)
  - CloudShell: pre-authenticated terminal in browser
- Best practices
  - Don't use root account except for AWS account setup
  - Don't share user key/secrets
  - Prefer group policies (add user to group, give group a policy)
  - Use strong password policy

## EC2

- Choosing & configuring an instance
  - AMI: Amazon machine image
  - Instance type
    - General, Compute-opt, Memory-opt, Accelerated computing, Storage-opt
  - OS (Linux, Windows, MacOS)
  - Compute power and cores (CPU)
  - Memory (RAM)
  - Storage space
    - Network (EBS/EFS) and hardware (EC2 instance store)
  - Network card & speed, public IP address
  - Firewall rules (security group)
  - Bootstrap script (configure at first launch) (EC2 User Data)

- Purchase options
  - On-demand (highest cost, no long-term commitment)
  - Reserved (discounted, time obligation)
  - Savings plans (discounted, time/usage obligation)
  - Spot instances (lowest cost, unpredictable, based on supply/demand)
  - Dedicated hosts (physical server with fully dedicated EC2 instance capacity)
  - Dedicated instances (single-tenant hardware)
  - Capacity reservations

## EBS

- EBS: Elastic block store
  - An EBS volume is a network drive that can be attached to an instance
  - AZ specific, can be moved across AZs using snapshots

## EFS

- EFS: Elastic File System
  - Managed network file system
  - Can be mounted on multiple EC2 (across AZs)
  - Highly available, scalable, more expensive
  - Linux only

## ELB

- ELB: Elastic load balancer
  - Managed load balancer service

- Load balancer benefits
  - Horizontal scalability and high availability
  - Spread load across multiple downstream instances
  - Expose single point of access to application
  - Seamlessly handle failures of downstream instances
  - Do regular health checks of instances
  - Provide SSL termination for website
  - Enforce stickiness with cookies (sticky sessions)
    - Application- and Duration-based cookies
  - Separate public/private traffic

Options:

- ALB: Application load balancer
  - HTTP/HTTPS/WebSocket
  - Can route using path, hostname, query, headers, etc
  - For EC2, ECS, Lambdas, private IPs, etc
  - app servers don't see client IP
    - get from For/Port/Proto headers (eg: 'X-Forwarded-For')
  - Connect to EC2 with Security Group
- NLB: Network load balancer
  - TCP/UDP (Layer 4)
  - high-performance
  - one static IP per AZ
  - not in AWS free tier
  - health checks on TCP, HTTP, or HTTPS
  - Connects directly to EC2 instances (no SG)
- Gateway: IP protocol (layer 3)
  - Improved security, compliance, and policy controls
  - Traffic through 3rd-party virtual appliances
    - Eg: firewalls, IDS/IPS, deep-packet inspection
  - Uses GENEVE protocol (port 6081)
  - More complicated setup
- Classic (deprecated): HTTP/HTTPS/TCP/SSL

- Cross-zone load balancing
  - Allows for more even distribution across zones
  - Enabled by default with ALB

- ELB + SSL/TLS
  - in-flight encryption between client/LB
  - uses TLS certificate issued by Certificate Security (CA)
    - Certificates can be managed with ACM (AWS Cert manager)

- Connection draining & deregistration delay
  - Time to complete in-flight requests when deregistering/unhealthy
    - Stops sending new requests to the EC2 instance
  - CLB: Connection draining
  - ALB/NLB: Deregistration delay

- ASG: Auto-scaling groups
  - scale in/out to match changes in traffic/load
  - replaces terminated (eg: unhealthy) EC2 instances
  - ASG Attributes
    - Launch template (similar params as EC2 config)
    - Min/Max size, initial capacity
    - Scaling policies
      - Target tracking (Eg: keep average ASG CPU at 40%)
      - Simple/Step scaling (Eg: add 2 units on cloudwatch alarm)
      - Scheduled actions: manual scaling
      - Predictive (forecast load and schedule scaling ahead)
    - Metrics: CPU, RequestCountPerTarget, average network i/o
    - Cooldown period (default 300s) after scaling activity

- Instance refresh
  - replacing all instances with an updated launch template

- SNI only works with ALB/NLB (no classic)

- Lambda function as target
  - Lambdas can be registered targets
  - Synchronously waits for lambda result (json)
  - Requires ELB to have permission to invoke

## VPC

- VPC: Virtual private cloud
  - A private network to deploy resources (per region)
  - Subnet: allow partitioning of network inside VPC (AZ resource)
    - public subnet: accessible from the internet
    - private subnet: not public
  - Route Tables: define access to the internet and between subnets
  - Default VPC in each region with default (public) subnet in each AZ
  - Internet Gateway (IGW): connects VPC instances to the internet
    - Public subnets have a route to the IGW
  - NAT
    - NAT: Allow instances in private subnets to access the internet
    - Types
      - NAT Gateway: AWS managed
      - NAT Instances: self-managed
  - Firewalls
    - NACL: Network access control list
      - Firewall which controls traffic from/to subnet
      - ALLOW and DENY rules
      - Operates at subnet level
      - Rules only include IP addresses
      - Stateless (return traffic must be explicitly allowed)
      - Automatically applied to all instances in the associated subnet(s)
    - Security groups
      - Firewall that controls traffic from an ENI/EC2
      - Can only have ALLOW rules
      - Operates at instance level
      - Rules include IP addresses and other SGs
      - Stateful (return traffic allowed)
      - Applies to instance if someone specifies/attaches the SG
  - VPC flow logs
    - Capture info about IP traffic to interfaces
    - VPC/Subnet/ENI flow logs
    - Transparency into subnet/internet connectivity issues
  - VPC peering
    - Connect two VPCs privately using AWS's network
    - Peered VPCs behave as if in same network
    - Must not have overlapping CIDR
    - VPC peering is not transitive, it is one-to-one
      - must be established for each VPC pair
  - VPC endpoints
    - Allow connecting to AWS services using a private network
    - Enhanced security and lower latency
  - Connect on-premise VPN to AWS
    - Methods
      - Site-to-site VPN
        - public internet connection (encrypted)
      - Direct Connect (DX)
        - physical (private) connection
    - No VPC endpoint usage

- Three tier solution
  - Public subnet
    - ELB (multi-AZ)
  - Private subnet
    - API services
  - Data subnet
    - DBs

## Route 53

- DNS: Domain name system
  - Translates human-readable hostname to IP address

- Route 53
  - Hosted zone: A Route 53 concept, analagous to traditional DNS zone file
    - A collection of records, belonging to a parent domain name
  - Records
    - Record contains: (sub)domain name, record type, value, routing policy, ttl
    - Route 53 supports the following DNS record types
      - Common: A, AAAA, CNAME, NS
      - CAA, DS, MX, NAPTR, PTR, SOA, TXT, SPF, SRV
    - Record types:
      - A: hostname -> IPv4
      - AAAA: hostname -> IPv6
      - CNAME: hostname -> hostname
      - NS: name servers for the hosted zone
        - control how graffic is routed for a domain
  - Registering a domain
    - TODO
  - Routing policies
    - Simple
    - Failover
    - Geolocation
    - Geoproximity
    - Latency
    - IP-based
    - Multivalue answer
    - Weighted

## RDS

- RDS: Relational database service
  - Managed SQL DB service
  - Postgres, Mysql, MariaDB, Oracle, Microsoft SQL Server, Aurora
  - Benefits
    - Automated provisioning, OS patching
    - Continuous backups
    - Monitoring dashboards
    - Read replicas
    - Multi AZ setup for disaster recovery (DR)
    - Scaling capability
    - Storage backed by EBS

- Storage auto scaling
  - increase storage on RDS DB instance dynamically
- Replication
  - Up to 15 read replicas
  - Within AZ, Cross AZ, or cross region
  - Async replication (eventually consistent)
  - Applications need to update connection strings to leverage
- DR
  - sync replication
  - increased availability
  - failover
- Aurora benefits
  - performance
  - automatic failover
  - backup and recovery
  - isolation and security
  - industry compliance
- Amazon RDS Proxy
  - Reduce stress on resources
  - improve failover time
  - enforce IAM auth
  - private (never publically accessible)

## Systems manager parameter store

TODO

## Elasticache

TODO

## s3

- S3: Simple storage service
  - Highly durable and available

- Buckets and objects (files)
  - Bucket names must be globally unique
  - Buckets are defined at region level
  - Bucket names: lower alnum + some special chars, not IP, starts with alnum
  - Object keys are the full path inside the bucket
    - `s3://{bucket}/{prefix}/{object name}`

- Permissions
  - Resource-based
    - bucket policy
      - buckets are private by default
    - object ACL
  - User-based
    - IAM policies controlling allowed s3 API usage

- Storage classes
  - less frequent/urgent access means smaller costs

- Encryption
  - in flight
    - https, ssl/tls
  - at rest
    - client-side
      - encrypted by client, prior to upload
      - decrypted by client, after download
    - server-side encryption
      - sse-s3: s3-managed keys, AES-256 encryption
        - header `x-amz-server-side-encryption`: AES256
      - sse-kms: AWS-KMS-managed keys
        - header `x-amz-server-side-encryption`: aws:kms
      - sse-c: customer-provided keys

- CORS
  - allow objects from one bucket to access objects in another bucket
  - eg: html requesting css/js/img files from different buckets

- S3 can host static websites
  - Bucket must have public read access

- S3 versioning
  - overwrites are stored as versions
    - protect against unintended overwrites
  - enabled at the bucket level

- S3 replication
  - Types
    - CRR: cross-region
    - SRR: same-region
  - Must have versioning in src/dst buckets
  - Buckets can be in different accounts
  - Replication is async
  - After enabling, only new objects are replicated
    - S3 batch replication: replicate existing objects and objects that failed

- S3 Lifecycle rules
  - Actions
    - Transition actions: Move to a different storage class
      - Move files, mark file versions to be moved
    - Expiration actions: Delete files
      - Delete files, versions of files, or incomplete multi-part uploads
  - Rules
    - prefix
    - tags

- S3 Event notifications
  - AWS EventBridge: TODO

- S3 Tags
  - TODO

- S3 Access logs
  - Log S3 events (good for security/auditing)

- Pre-signed urls
  - Make a private file temporarily accessible

## KMS

- Encryption key service
- Integrates with multiple AWS services
- Audit key usage using cloudtrail
- kms commands
  - `aws kms generate-data-key`
    - Generate CMK
  - `aws kms encrypt`
  - `aws kms decrypt`
  - `aws kms re-encrypt`
    - Decrypts then re-encrypts using a specified CMK
    - Useful when rotating CMKs
  - `aws kms enable-key-rotation`
    - Enable automatic key rotation (every 365 days)
- Envelope encryption
  - About
    - CMK: customer master key
    - CMK used to encrypt/decrypt Data Key
    - Data Key: used to encrypt/decrypt data
  - Envelope encryption improves performance
    - only key is sent over network, instead of sending full data to KMS
    - gt 4KB, use envelope encryption

## Cloudfront

- Cloudfront is a CDN
- Well integrated with other AWS services (s3, etc)
- CF edge location: location where content is cached
  - 200+ edge locations
- CF origin: origin of all files that the distribution will serve
  - S3 bucket, EC2 instance, ELB, Route 53, etc
- CF distribution: name given to the CDN content's origin and config settings
- Cached with TTL
  - Default is 1 day (86400)
  - Busting cache manually has an associated fee
    - CloudFront Invalidation for cache invalidations
- S3 transfer acceleration
  - data at edge location is routed to s3 over an optimized network path
  - benefit: faster s3 uploads at the edge
- Distribution can take 15-20 minutes to take affect
  - provisioning/replicating at edge locations

## Serverless

Benefits:

- Scalability
- Pay per execution (don't pay for un-utilized uptime)

Cost:

- Requests
  - $0.20 per 1 million requests
  - first 1 million requests per month are free
- Duration/Memory usage
  - Charged in 1 ms increments ($1.67e-5 per GB-second)
  - First 400k GB-seconds per month are free

Services:

- Lambda
  - Serverless compute (AWS handles environment & server provisioning)
- SQS: simple queue service
- SNS: simple notification service
- API gateway
  - handle http requests with lambda, log to cloudwatch, throttle/cache requests
- Data storage: RDS, DynamoDB, S3, etc

About:

- Event-driven (triggered, invoked, queued)
- Triggered: events (eg: s3 upload), user requests (eg: api gateway)
  - Many AWS services can invoke lambda functions
  - Eg: add api gateway trigger to lambda
- Concurrency limit default 1000 per region (429 TooManyRequests)
  - Contact AWS Support to get limit raised
  - reserved concurrency: guarantees availability of n concurrent executions

Event Source Mappers:

- TODO

Event/Context:

- Event
  - JSON object containing job payload (ie: input args)
  - Contains info from the invoking service
- Context
  - Provides properties/methods that provide info about the invocation

IAM Role:

- Lambda needs role to access AWS services/resources

VPC:

- Lambda needs VPC config info to connect to VPC
  - private subnet id, security group id (with required access)
  - lambda sets up ENIs using an available IP from the private subnet
    - ENI: Elastic network interface
  - `aws lambda update-function-configuration ...`

Containers:

- Deploy a lambda function as a container
  - Up to 10GB
  - Pack complex/large dependencies in a container
  - Use base images (or implement the Lambda Runtime API)
  - Lambda Runtime Interface Emulator
    - Test container locally

Lambda Aliases:

- TODO

Step functions:

- Model workflows as state machines
- Orchestrate a pipeline of (potentially concurrent) lambdas
- Uses Amazon States Language
  - JSON-based language
  - defines state machine
  - collection of states (Task, Choice, Fail)
- Error handling
  - States can encounter runtime errors for various reasons
  - Definition issues, task failures, transient issues, etc
  - Use Retry (retry failed state) and Catch (transition to failure path)
    - Don't handle errors in application code
- Visualize workflows
- Outputs are piped as inputs of next step
- Each step is logged for transparency/debugging

X-Ray:

- A tool for helping developers analyze/debug distributed services
- X-Ray automatically captures metadata for API calls to AWS services
- has an SDK for integrating with lambdas/servers
  - requries both SDK and daemon on system(s)

## DynamoDB

- Low-latency NoSQL database
- Document and key/value data models
- ACID
- Keys
  - Partition key
  - Composite: partition + sort key
- Indices
  - Local secondary index
    - Must be created during table creation
  - Global secondary index
    - Can be created anytime
- Scans/Queries
  - TODO

## SQS

- SQS: Simple queue service
- Used to queue messages for another service to consume
- Queue: temporary repository for messages
- Distributed message queueing system
- Decoupled infrastructure
  - If consuming service fails, message is not lost
  - Mitigates issues between producers/consumers
    - Different speeds, intermittent connections, consumer fails, etc
- Pull-based, for push-based use SNS
- Messages are text data, capped at 256KB size
- Types
  - Standard (default): best-effort ordering, gte 1 message delivery guaranteed
  - FIFO: strictly-preserved first-in-first-out, exactly-once processing
    - Better message behavior, but capped at 300 transactions-per-second (TPS)
- Visibility timeout
  - Time allowed for a msg to be processed
  - Msg is in queue still, but is "invisible" for that timeout period
  - Will become visible again if not completed within timeout period
  - Timeout period can be customized (eg: for longer jobs)
- Polling
  - short or long
  - long preferred (cheaper)
- SQS delay
  - msg will be invisible for duration of delay period
  - default is 0, max is 900s
- Use s3 to store large messages (gt 256KB)
  - AWS has a solution with uses SQS extended client library (Java)
  - Manual solution: store data in s3, link to it in msg

## SNS

- SNS: simple notification service
- push notifications (eg: iOS twitter notification)
- pub/sub model
  - apps publish/push messages to a topic
  - subscribers receive messages from a topic
- formats messages correctly per platform (ie: iOS, android, sms, etc)
- quick, managed (highly-available/durable), simple, flexible, inexpensive

## SES

- SES: simple email service
- incoming or outgoing
  - incoming: trigger lambda or SNS
  - outgoing: send emails

## EB

- EB: Elastic beanstalk
- Deploy and scale
- Supports many languages and platforms
- Handles LB, EC2 instances, security group, scaling, APM, storage
- No additional charge for this service, just the underlying resource usage
- Efficient deployment strategy
- Deployment options
  - All at once
    - Not good in prod. Deployment will cause total outage
  - Rolling
    - Capacity is reduced by batch size
  - Rolling with additional batch
    - Additional batch during deployment, to maintain full capacity
  - Immutable
    - Full set of new resources ready/healthy before terminating old resources
    - Preferred method
  - Traffic-splitting
    - Test deployment in prod
    - Percentage of traffic routed to new instances before full deployment
    - Similar to Immutable
- Can configure environment using EB config files (yaml/json)
- Set env vars can be set in EB Configuration (in AWS Console)
- DB
  - Options
    - Use EB to launch RDS
      - DB will be terminated with env
      - Okay for dev/test envs
    - Launch RDS instance externally
      - DB will outlive EB environment
      - Requires adding an additional security group to the auto-scaling group

## Kinesis

- Kinesis: services to collect/process/analyze streaming data in real time
- services
  - Kinesis streams
    - Proces data/video streams in real time
    - Consumer application data processing
  - Kinesis data firehose
    - Capture, transform, load data into AWS data stores
      - or other data services like datadog
    - useful for BI
  - Kinesis data analytics
    - Analyze/query/transform streamed data in real time
    - SQL interface, store processed data in an AWS data store

## Advanced AIM

- Cognito
  - Web ID federation

- IAM policies
  - AWS-managed policies
  - customer managed policies
  - inline policies

- STS: security token service
  - Authenticate with a web identity provider to access AWS resources
  - On successful API call, STS returns temporary credentials

- Cross-account access
  - TODO

## CloudWatch

- CloudWatch: monitoring service to monitor the AWS reseource health/performance
- Can monitor many AWS services
- Agent for measuring custom metrics
- Cloudwatch alarms: send alerts when specific metric thresholds are exceeded
- Cloudwatch logs: TODO

## Cloudtrail

- Cloudtrail: records user activity in an AWS account

## CICD

- CI/CD: Continuous integration, continuous development/deployment
- Services
  - CodeCommit: managed version control system
  - CodeDeploy: managed deployment service
  - CodePipeline: continuous delivery pipelines (build/test/stage/prod)

## ECS

- ECR: Elastic Container Registry
  - AWS's docker image repository
    - Store and manage docker images on AWS
    - Fully integrated with ECS, backed by S3
  - Access control with IAM
  - Supports vulnerability scanning, versioning, tags, lifecycle, etc

- EKS: Elastic Kubernetes Service
  - AWS's managed K8s service
  - cloud-agnostic alternative to ECS
    - Similar end goal, but different API
    - Great if migrating K8s infra to AWS
  - Supports EC2
  - Nodes
    - Managed node groups
      - Creates/manages nodes, which are part of an AWS-managed ASG
    - Self-Managed nodes
    - Fargate
      - no managing/maintenance of nodes
  - Data volumes
    - EKS cluster needs a specified StorageClass manifest
    - leverages Container Storage Interface (CSI) complienat driver
    - Supports EBS/EFS/FSx

- AWS Fargate
  - AWS's own serverless container platform
    - AWS-managed serverless infrastructure
  - Works with ECS/EKS

- ECS: Elastic container service
  - Launch docker container on AWS
  - Launch ECS Tasks on ECS Cluster
  - ECS Clusters
    - logical grouping of tasks/services
    - Launch types:
      - AWS Fargate: managed/serverless, just create task definitions
      - EC2: user provisioned/maintained infra, instances must run ECS agent
      - external instances
    - IAM Roles
      - EC2 Instance profile (used by ECS agent)
      - ECS Task Role
  - AWS ECS load balancer integrations
    - ALB routes requests to ECS cluster, requests handled by ECS task(s)
  - Data volumes
    - Mount EFS file systems onto ECS tasks (Compatible with both EC2/Fargate)
  - Task placement
    - For EC2 Launch type, define task placement strategy/constraints
      - Strategies: Binpack, Random, Spread
      - Constraints
    - Determines placement during scale out and termination on scale in
    - Fargate launch type doesn't need this, as AWS manages infra

- AWS Copilot
  - CLI tool to build/release/operate prod-ready containerized aps
  - Simplifies AppRunner/ECS/Fargate by handling infra

## CloudFormation

- CloudFormation: Infrastructure as code

## SAM

- TODO
