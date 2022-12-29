# --------------------
# AWS (2019)
# --------------------

# --------------------
# account basics
# --------------------

# create account
# set up MFA (multi-factor authentication)
# set region -- 'N. Virginia' has all services available.

# resource groups -- tagging resources (ie ec2) to create groups
# billing alerts -- go to 'billing', edit preferences, check 'receive billing alerts'
# cloudwatch -- go to 'cloudwatch', go to billing, create alarm

# --------------------
# regions
# --------------------

# regions
    # example: us-east-1
# availability zones
    # example: us-east-1a

# each availability zone is a physical data center in the region.
# AWS consoles are region scoped (except IAM and S3)
# make sure you start your projects in an appropriate region

# --------------------
# IAM (identity access management)
# --------------------

# account -- your AWS account
# users -- users created by an AWS account, given specific permissions.
# groups -- group of users. a way to assign permissions to multiple users.
# roles -- security roles given to an entity (service, instance, etc)

# best practice: 
    # don't use root account (except during initial setup)
    # give users minimum ammount of necessary permisions (least privilege).
    # one user per person (no sharing)
    # one role per application (no sharing)
    # IAM credentials should never be shared
    # don't put credentials in code

# often, it's better to assign access policies to groups (than to individual users)
    # create group. add policy. add users to group.
    # if a specific user needs more permissions, add to additional group (up to 10 groups / user)

# when you create an account, a root account is created. root has admin access.
# any created users will start with no access rights. access must be granted.
# best practice is to create individual IAM users.

# creating users
    # IAM > add user
    # choose username
    # choose access (programmatic, AWS management console)
    # set password
    # add to group (create groups and add roles to those groups)
    # when user created, a link to login for that user is given.
    # IMPORTANT: access key pair given, save as file. it will not be shown again.
# to give someone access:
    # create a user
    # assign to group to give permissions, or attach access policy to user

# roles -- collection of access permissions for a service or other trusted entity.
    # if EC2 instance needs to access s3 resources, it needs a role with proper permissions.
    # create role, choose permissions, choose name. attach to service/entity.

# using IAM (example 2)
    # services > IAM
    # initial setup
        # delete keys 
        # use MFA 
        # create IAM users 
        # use groups 
        # apply IAM password policy
    # add user
        # name, both access types, set password (possibly require reset)
        # permissions -- copy user to group or attach policy (example: administrator access)
        # create user -- IMPORTANT: download CSV. (It won't be shown again)
    # create group -- enter name, select policy, create group. add users to group
    # create account alias
        # next to 'IAM users sign-in link', click customize
        # set account alias
        # this will customize sign-in link.

# --------------------
# network services
# --------------------

# understanding VPCs
    # within a region, create a VPC (virtual private cloud)
    # each VPC contains subnets (public and private)
        # public -- static websites, files, load balancers
        # private -- databases, servers (communicates with LB)
        # depending on configuration, some people put EC2 in public.
    # each subnet must be mapped to an availability zone (AZ)
    # it is common to have many subnets per AZ
    # public and private subnets can communicate (if they're in the same VPC)
    # VPCs can communicate with each other through 'peering'
# create private networks (vpc -- virtual private cloud)
    # logically isolated, defined virtual network.
    # complete control over networking env
        # IP address range, creation of subnets, route tables, and network gateways
# vpc is a network
    # when creating a new VPC, a CIDR block must be specified.
        # https://docs.aws.amazon.com/vpc/latest/userguide/working-with-vpcs.html#vpc-associate-ipv6-cidr
        # example CIDRs: 10.0.0.0/8  172.16.0.0/12  192.168.0.0/16 
    # create new subnet and associate VPC to subnet
# internet gateway (IGW) -- kind of like a modem. gives private network a route to the internet
    # communication between VPCs and he internet requires an IGW.
    # highly available and redundant
    # when AWS account is created, a default VPC and associated IGW are created
    # a VPC can only have 1 IGW attached (at a time)
        # cannot detach IGW if services running in vpc (RDS, EC2, etc)
# route table (RTs) -- where to send traffic within my netowrk (vpc)
    # internal traffic -- (ie -- 172.31.0.0/16, local)
    # outbound traffic -- attach RT to correct IGW (ie -- 0.0.0.0/0,  IGW_id)
    # cannot delete route tables with dependencies
    # by default, subnets can communicate to each other (I think??) (internal traffic)
    # multiple RTs can exist
    # new RTs need to be connected to IGW and subnets (as desired).
    # connecting subnets to a RT that doesn't have an IGW are private
# network access control list (NACL) -- similar to a firewall (at subnet level) (allow/block traffic)
    # optional layer of security for VPC
    # associated with subnets
    # rules
        # STATELESS -- responses to allowed inbound traffic are also subject to rules for outbound traffic.
        # inbound rules AND outbound rules
        # rules are executed by 'rule #' (low to high) (default is last)
        # the first rule that matches is applied
        # to allow traffic, specify rule.
        # default rule (*) denies all. 
        # specify type (ie: SSH), protocol (ie: TCP(6)), port range (ie 22), source (ie: 0.0.0.0/0)
        # initial NACL allows SSH connections by default, while new (created) NACL denies all.
        # new NACLs need rules to allow connections!!
# subnet (sub-network)
    # sub-selection of a network. (analogy: ISP -- network, home network -- subnet)
    # public subnet -- traffic is routed to an IGW. (subnet is connected to RT, connected to IGW)
    # private subnet -- doesn't have a route to the IGW. (subnet is connected to RT, NOT connected to IGW)
    # subnets can be named. Public 
    # N. Virginia region has 6 availability zones.
        # when initial VPC/RT/NACL were created, 6 subnets were created (1 for each zone).
    # even if subnets are not explicitly associated, by default they are implicitly connected (via main RT)
# availability zones
    # each region has multiple availability zones
    # an AWS resource must be placed in a VPC subnet.
    # a subnet must be located in a availability zone.
    # multiple availability zones create redundancy (high availability and fault tolerance)

# --------------------
# compute services (ec2)
# --------------------

# ec2 -- elastic cloud compute
    # cost factors -- purchase option, instance type, AMI, data transfer, region

# purchase options
    # on-demand: provision/terminate at any time. most expensive, most flexible.
    # reserved: instance purchased for a year (or 3). significant discount.
    # spot: "bid" for an instance. cheap, instance terminates when desired bid price is exceeded.

# instance type -- hardware capabilities of the host computer
    # general purpose
    # compute organized
    # accelerated computing
    # memory optimized
    # storage optimizeds
    # EBS optimized (better IOPS performance)

# AMI (amazon machine image) (OS + optional software packages and config)
    # what it is:
        # root volume template (OS + optional application software)
        # launch permissions
        # block device mapping (EBS for additional drives)
    # AMI options
        # community AMIs -- free, usually just an OS
        # AWS marketplace AMIs -- pay to use, comes with licensed software (linux is usualy free)
        # my AMIs -- AMIs that you create yourself.
    # an AMI (from an EC2 instance) can be used as a template for future EC2 instances.
    # AMIs are region specific

# EBS -- elastic block store (storage volume for EC2 instance)
    # each EC2 instance comes with a root volume.
        # root volume will be deleted unless 'deleted on termination' is unchecked.
        # in this case, deletion of EC2 instance will leave volume detached.
        # 'add new volume' to attach additional volumes.
    # highly available/reliable storage volume.  
    # Can only be attached to an EC2 instance in the same availability zone
    # an EBS volume that is attached to an EC2 instance is exposed as a storage volume.
        # non-root volumes will not be deleted if instance is deleted.
        # non-root volumes can be attached/detached at any time
    # snapshot -- an image (backup) of an EBS volume.
        # not a volume. cannot be directly attached to an EC2 instance.
        # restore a snapshot by creating a new EBS volume and using the snapshot as its template

# security groups -- allow/deny traffic (at instance level) (rules work different than NACL rules)
    # by default: traffic is denied, unless there is an explicit 'allow' rule for it.
    # STATEFUL -- if a request is allowed (inbound), its response is also allowed (outbound)
    # initial security group: all traffic is allowed (inbound & outbound)
    # new security group default: all inbound traffic is denied and all outbound traffic is allowed.
        # add HTTP/TCP/80 rule to enable HTTP (TCP protocol) requests to port 80
    # make sure security groups are homogeneous among similar EC2 instances (for consistency between)
    # best practice -- don't leave open to the world, whitelist known IP addresses.
    # example (allow for ssh and web traffic) -- ssh/tcp/22  http/tcp/80

# IP addressing -- providing an EC2 instance with a public IP address.
    # private IP address -- all EC2 instances have one by default.
        # private IP addresses alow for instances (in the same VPC) to communicate with each other
    # public IP address -- EC2 instance can be launched with or without 
        # public IP addresses are required for an instance to communicate with the internet
        # created VPCs (not initial) by default have public IP turned off.

# ELB -- elastic load balancer (balance requests between multiple EC2 instances)

# flow (EC2 to the internet)
    # EC2 > IP Addressing > security group > NACL > route table > IGW > Internet

# creating/launching an instance
    # security prep -- create/edit users/groups/roles
    # network prep -- create/edit IGW/RT/NACL/VPC/subnets
    # EC2 dash > launch instance
    # select AMI
    # select instance type
    # add storage (EBS)
    # add tag (give instance a name)
    # configure security group
    # set up / verify IP addressing
    # launch
    # create/download key pair (for ssh access in linux instances)

# logging in to an instance (ssh)
    # select instance
    # under 'actions', choose 'connect'
    # follow instructions:
        # open terminal
        # navigate to directory containing keypair
        # run 'chmod' command (example below):
            # chmod 400 filename.pem
        # run the ssh command (example below):
            # ssh -i "filename.pem" ecw-user@public_dns.compute-1.amazonaws.com

# --------------------
# ec2 (example 2)
# --------------------

# create ec2 instance
    # services > ec2 > ec2 dashboard
    # launch instance
    # chosse AMI (amazon machine image)(ie: ubuntu 18.04)
    # choose instance type (hardware specs) (ie: t2.micro)
    # configure instance details
        # specify number of instances, vpc, subnet, IAM role, monitoring, tenancy, unlimited
        # under advanced details -- user data script (bootstrapping)
    # add storage -- by default, it comes with storage. more volumes can be added.
    # add tag -- name the instance (ie -- key: Name, value: my_app)
    # configure security group -- write rules for traffic (ie: ssh/22, http/80, https/443)
    # launch -- IMPORTANT: use existing keypair or create new. download keypair (.pem).
        # .pem file is needed to SSH into instance

# ssh into ec2
    # make sure NACL and SG allow traffic on port 22
    # ec2 dashboard > instances > click on instance > get public IP
    # IP address will change every time you stop/start instance
        # elastic IP can make address static
        # ec2 dash > elastic IPs > allocate new address
        # associate elastic IP with instance
        # to dissociate -- ec2 dash > right click instance > networking > dissociate elastic IP
    # change permissions on .pem file
        # chmod 0400 my_key_pair.pem
    # ssh in
        # amazon linux -- ssh ec2-user@35.180.100.144 -i /path/to/my_key_pair.pem
        # ubuntu -- ssh ubuntu@35.180.100.144 -i /path/to/my_key_pair.pem
        # ubuntu -- ssh 35.180.100.144 -l ubuntu -i /path/to/my_key_pair.pem

# install on ec2
    # ssh in
    # sudo apt-get update -y
    # sudo apt-get install my-dependency -y

# copy files to ec2
    # scp -i /path/to/your/.pemkey -r /copy/from/path user@server:/copy/to/path

# bootstrapping ec2 instance
    # bootstrapping -- launching commands when machine starts (only run once)
    # bootstrapping for ec2 is done with an 'EC2 User Data' script
    # install updates, install software, download files, start service?
    # script will use root user
    # when creating instance: configure instance > advanced details > user data
    # script should start with shebang -- #!/bin/bash


# bootstrap docker-compose example

#!/bin/bash
sudo apt update -y
# docker
sudo apt install -y docker
sudo service docker start
sudo usermod -a -G docker ubuntu
# docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/1.25.0-rc2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
# build/run
### download application ???
docker-compose up --build

# custom AMI
    # pre-installed packages
    # faster boot time, faster deploys (when autoscaling)


# --------------------
# simple storage service (S3)
# --------------------

# s3 -- online storage service. scalable, reliable, fast, inexpensive, accessible.
# buckets -- root level directory.
    # subdirectories in a bucket are called 'folders'
    # use subdirectories to keep objects organized
    # technically, no such thing as directories. just keys with long names and slashes.

# using s3
    # services > storage > s3
    # create bucket
        # enter bucket name and select region. (name must be lowercase and unique)
        # uncheck 'block new public ACLs from uploading public objects'
        # uncheck 'remove public access granted through public ACLs'
        # server access logging -- logging can give you insight into your bucket's traffic
            # DO NOT STORE THE LOG FOR A BUCKET IN THE BUCKET (INFINITE LOOP)
        # tags -- buckets can be tagged
        # default encryption -- files can be encrypted when they are stored.
        # other AWS accounts can be added (permissions)
        # public permissions -- if enabled, anyone has read access

# buckets and objects
    # buckets are stored in regions
    # names: unique; 3-63 chars; lowercase, numbers, hyphens; no underscores or uppercase
    # summary -- clicking on a bucket (whitespace) opens a properties summary
    # properties -- clicking on a bucket (text) opens overview/properties/permissions/managmeent

# storage classes -- the classification assigned to each object in s3
    # classes
        # standard -- default. general storage (99.999999999% durability, 99.99% availability)
        # standard infrequent access (Standard_IA) -- cheaper base price, but retrieval is costly
        # one zone infrequent access (OneZone_IA) -- same as Standard_IA but cheaper, less available (99.5%)
        # glacier -- long term storage. cheap, but slow retrieval (hours).
    # classes can be changed from bucket summary (click whitespace around bucket/object)
    # multiple classes can be changed by selecting multiple > actions > change storage class
    # moving an object to 'glacier' storage class requires usage of 'object lifecycles' (takes ~2 days)

# encryption
    # encryption can be set per file. default encryption can be set in in a bucket's properties
    # default encryption types:
        # SSE-S3 -- encrypts S3 objects using keys handled/managed by AWS (AES-256)
        # SSE-KMS -- leverage AWS Key management Service to manage encryption keys
        # SSE-C -- mange your own keys (send object/key to AWS, AWS will encrypt and discard key)
        # Client-side -- AWS does nothing, you handle encryptin yourself.
    # policies for encryption?

# object lifecycles -- time-based rules that automate the migration of an object's storage class
    # lifecycle functionality is located on bucket level
    # policies can be applied to buckets, specific folders, or specific objects.
    # to implement policy:
        # click on bucket > management tab > add lifecycle rule
        # transition: add transition, check current version, select transition, enter days

# permissions -- granular control over who can view/access/use specific buckets and objects
    # bucket level policies can be created using 'policy generator' in 'permissions' tab
    # manual permission functionality is located on bucket and object level.
        # bucket level:
            # list objects -- who can see contents
            # write objects -- who can write objects
            # bucket permissions -- who can read/write permissions
        # object level:
            # open/download -- who can use the object
            # view permissions -- who can view object permissions
            # edit permissions -- who can edit object permissions
    # there are also user based policies (IAM)

# object versioning -- feature keeps track of and stores all versions of an object.
    # versioning is either ON or OFF.
    # once it is turned on, it can only be suspended. (it can't be turned off again).
    # only applicable on bucket level, applies to all objects in the bucket.
    # when versioning, lifecycles can help manage cost. (move older versions into cheaper storage.)


# --------------------
# aws database services (RDS) (DynamoDB)
# --------------------

# databases should be in a private subnet (ec2 in public)
# AWS supports two database systems: RDS (sql) and DynamoDB (no-sql)

# relational database service (RDS) -- scalable, cost-efficient, industry standard relational db.
    # Amazon Aurora (similar to mysql, faster/more performant)
    # MySQL
    # MariaDB
    # PostgreSQL
    # Oracle (several options)
    # Microsoft SQL Server (several microsoft options)

# DynamoDB -- consistent, fast, flexible, reliable NoSQL db service.
    # MongoDB
    # Cassandra DB
    # Oracle NoSQL

# pricing -- based on engine, instance class, purchase option, storage size, data transfer

# provisioning an rds db (mysql)
    # Aurora uses port 3306. 
    # configure private subnet group:
        # RDS dashboard > subnet groups
        # have two private subnets created
        # create DB subnet group
        # complete form (requires availability zones of subnets)
    # RDS dashboard > create db
    # instance specifications
        # select instance class
        # enter 'db instance identifier' (name)
        # specify master username/password
    # Network and Security
        # select VPC, subnet group, availability zone
        # enter database name and port
        # select backup retention period
    # after creation, look for endpoint/port (under 'connect' section)
    # security group needs rules that allow db to communicate with other intances.
    # mysql workbench 
        # install mysql workbench and open it
        # give connection a name.
        # select 'standard tcp/ip over ssh' connection method
        # set up new connection in MySQL workbench.
        # ssh hostname -- public IP address of the ec2 instance (tunneled through)
        # ssh username -- ec2-user (username used to ssh into ec2)
        # ssh key file - the .pem key used to ssh into ec2
        # copy 'writer endpoint' from rds console and paste it into mysql hostname field.
        # set port to 3306
        # enter username/password
        # test connection, click 'OK' to connect
    # SSH tunneling allows for communication to a db. (goes through IGW, RT, NACL, SG, RT)
        # check all rules/configurations to make sure ssh can pass through all.
        # waiting a few seconds after implementing changes is sometimes necessary.

# use ssl
    # enforce ssl
        # postgres --rds.force_ssl=1 (in the AWS RDS console)
        # mysql -- GRANT USAGE ON *.* TO 'mysqluser'@'%' REQUIRE SSL; (within DB)
    # connect using ssl
        # provide ssl trust certificate (can be downloaded from AWS)
        # provide ssl options when connecting to db

# --------------------
# elasticache
# --------------------

# elasticache -- managed Redis or Memcached instance

# --------------------
# simple notification service (sns)
# --------------------

# sns -- a service for automated emails/texts based on AWS account events
# example -- server crash, cloudwatch (cw) detects/triggers alarm, message sent to admin
# pricing -- based on publishes (message), deliveries (endpoints), data transfer (in/out)

# sns basics
    # topics -- labels/groups for different endpoints that messages will be sent to
        # have unique ARN (amazaon resource name)
    # subscriptions -- the endpoints that a topic sends messages to
    # publishers -- the entity that gives SNS the message that needs sending.

# sns workflow
    # sns dashboard > create topic
        # enter topic name and display name (<=10 chars)
    # add subscriptions
        # select protocol (email, text, http, etc) and enter endpoint
    # confirm subscription
    # publish
        # topics > publish to topic
        # enter subject and message
        # publish


# --------------------
# management tools (cloudwatch)
# --------------------

# cloudwatch -- service for monitoring an AWS account (metrics, alarms, thresholds/actions)
    # view metrics for ec2 (cpu usage, status, disk r/w), s3 (object count, bucket size), billing
    # set thresholds that trigger alarms or actions

# pricing
    # https://aws.amazon.com/cloudwatch/pricing/
    # dashboards, detailed monitoring (ec2), CW custom metrics, CW API request, CW logs, CW events
    # free tier available

# creating a dashboard
    # cloudwatch > dashboards > create dashboard
    # give it a name
    # add widgets
        # select widget type, metric, and reasonable time period for the metric
        # example: line widget, ec2 instance metric, cpu utilization, 1 day
    # save dashboard

# create cloudwatch alarm
    # cloudwatch > alarms > create alarm
    # select metric category
    # set name/description for threshold
    # set threshold (comparison operator) (value)
    # set period (alarm triggered if threshold exceeded >1 in a period)
    # set action (alarm) (notification recipients)
        # for ec2, could trigger autoscaling or ec2 actions.
    # example: total estimated charges (billing metric), > $10, send notification to recipient


# --------------------
# management tools (cloudtrail)
# --------------------

# cloudtrail -- service for monitoring actions taken by your AWS account.
    # actions taken by users, roles, services are recorded as events.
    # events include actions taken in AWS management console, CLI, SDK, and API.
    # logs are saved into an S3 bucket in a gzip archive

# pricing
    # no free usage
    # based on management events (create instance), data events (s3 get/put/delete action), usage (s3, sns)

# create trail
    # cloudtrail > dashboard > create trail
    # set name
    # set log type (all, read, write, none) for management and data events
    # storage location (existing or new s3 bucket) (new bucket won't have permission problems)


# --------------------
# ELB (load balancing)
# --------------------

# elastic load balancer (ELB)
    # distributes traffic between EC2 instances
    # detects unhealthy instances and routes traffic to healthy ones
    # traffic > IGW > ELB > RT > NACL > subnet > SG > EC2 instance

# pricing
    # no free tier
    # based on hour/partial hour of runtime, GBs of data transferred through LB.

# creating an ELB
    # ec2 dashboard > load balancers > create load balancer
    # select LB type -- application (http/https) network (tcp)
    # name, scheme, IP address type (ie -- myapp_lb, internet-facing, ipv4)
    # listener -- protocol and port (ie -- http/40, https/443)
    # select VPC
    # select multiple subnets (different availability zones) (public if internet-facing)
    # configure security settings (if using https)
    # select SG
    # configure routing
        # target group -- where requests will be routed (instances must be registered to group)
        # name -- name of target group
        # protocol -- http
        # port 80
        # target type -- instance
    # health checks
        # protocol -- http
        # path -- / (or specify default path)
        # healthy threshold -- how many checks until considered healthy
        # unhealthy threshold -- how many checks until considered unhealthy
        # timeout -- ?
        # interval -- time between checks
        # success codes -- 200
    # register targets
        # select instances, add to registered (specify port)
    # to make sure traffic goes through ELB (not straight to instance)
        # edit inbound rules for instance, only allow http/80 from ELB's security group

# --------------------
# ELB (autoscaling)
# --------------------

# autoscaling -- scales in/out (more/less instances) to handle workload
    # ensure the correct number of instances running.
    # can specify min/max number of instances in an autoscaling group.
    # autoscaling is free, but instances created by autoscaling may incur charges.
    # not autoscaling -- scaling up/down means resizing rerouces (memory or disk space).

# autoscaling components
    # launch configuration -- ec2 template used when autoscaling needs to add instances.
    # autoscaling group -- rules/settings that govern when an instance is added/removed

# launch configuration (step 1)
    # EC2 > launch configurations (autoscaling) > create launch configuration
    # choose AMI, instance type
    # configuration details
        # name
        # user data (advanced details) -- bash script to install/configure
        # ip address type -- select 'assign a public IP address to every instance'
    # configure security group 
    # create launch configuration 
        # requires key pair for ssh (can use existing key pair)

# autoscaling group (step 2)
    # after creating launch configuration, click button 
        # 'create an autoscaling group using this launch configuration'
    # enter name
    # enter group size (inital # of instances)
    # select VPC,
    # select subnets (already created public subnets)
    # check 'receive traffic from one or more load balancers'
    # enter target group
    # configure scaling process 
        # use scaling policies to adjust the capacity of this group
        # set min/max instances
        # set scale group size
            # name
            # metric type -- deciding factor for scaling (ie -- average cpu utliization)
            # target value -- threshold where additional instance is created (ie -- 80)
            # instances need -- time period after scaling (to allow for installation and setup)
    # configure notifications
        # send notifacation to topic
        # select cases that should cause a notification to be sent.

# --------------------
# route 53
# --------------------

# route 53 -- configure and manage web domains for apps/sites you host on AWS
    # domain registration -- register/claim a domain
    # domain name system (DNS) service -- service for converting domain to IP address.
    # health checking -- route 53 sends automated requests to domain, to check health.

# record types:
    # A -- URL to IPv4
    # AAAA -- URL to IPv6
    # CNAME -- URL to URL
    # Alias -- URL to AWS resource (A record, alias (yes), alias target (ELB))

# using route 53 (register domain)
    # route 53 dashboard > registered domains > register domain
    # enter domain name (check avaliability)
    # enter registrant/administrative/technical contact info (can be same person)
    # enable privacy protection (keep your personal info private)
    # once submitted, wait a little bit for process to complete

# hosted zones
    # route53 dashboard > hosted zones
    # there are DNS record sets (preconfigured by AWS)
    # create 2 'Type A' record sets that route to your ELB
        # one with 'www.' in front, one without.
        # for 'Alias', select 'YES'
        # for 'Alias Target', select the ELB
        # leave the 'Routing Policy' as 'Simple'.
        # until ready, leave 'Evaluate Target Health' as 'No'.

# --------------------
# cloudfront
# --------------------

# cloudfront -- service that replicates data/video/applications to reduce latency
    # static and dynamic content are distributed faster
    # CF delivers content through a worldwide network of data centers called edge locations.
    # a user requests content served with CF and is routed to the best edge location.

# skipped for now

# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




# --------------------
# 
# --------------------




