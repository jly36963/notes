# ------------------
# AWS
# ------------------


# ------------------
# IAM (Identity Access Management)
# ------------------

# manage users and their level of access to the AWS console.
  # centralized control ver your AWS account
  # shared access to your AWS account
  # granular permissions
  # allows for multifactor authentication

# permissions
  # users (people)
  # groups (collection of users)
  # roles (define a set of permissions for an entity (user or service))
  # policies (a document that defines permissions)(assigned to uesr, group, or role)


# ------------------
# IAM setup
# ------------------

# sign in to console
# open 'All services' dropdown
# go to 'Security, Identity, & Compliance'
# IAM

# minimum security requirements
  # delete root access keys
  # create multi-factor authentication on root account
    # download a compatible MFA app (google authenticator)
    # scan QR code with phone
    # enter 6-digit number into 'Authentication code 1', wait, repeat
  # create individual IAM users
    # click 'add user' button
    # check 'programmatic access' & 'AWS Management Console Access'
    # require password reset (at next log in)
    # set permissions
      # create group if necessary
      # assign permissions
        # administrator access -- can do anything
        # system administrator -- can do a lot of stuff
    # download credentials.csv (IMPORTANT -- YOU CAN ONLY DO THIS NOW)
  # use groups to assign permissions
  # apply IAM password policy

# create role
  # you can grant permissions to a trusted entity
    # IAM user in another account
    # application code on an EC2 instance that needs to perform actions on AWS resources
    # an AWS service that needs to act on resources in your account to provide its features
  # example:
    # create role
    # aws service (ec2)
    # s3 (AmazonS3FullAccess)

# ------------------
# EC2 introduction
# ------------------

# Amazon EC2 -- Amazon Elastic Compute Cloud
  # cloud server (kinda)

# instance types
  # on demand (hour by hour, unpredictable usage)
  # reserved (cheaper, 1 to 3 year term)
  # spot (bid for instance capacity, great for apps with flexible start/end times)
  # dedicated hosts (physical server dedicated for your use)

# ------------------
# EBS introduction
# ------------------

# Amazon EBS (elastic block store)
  # cloud disk (kinda)
  # ebs -- create storage volume and attach to EC2 instance

# instance types
  # General Purpose SSD (GP2) (SSD)
    # generl purpose (up to 10k IOPS) (IOPS -- input/output per second)
  # Provisioned IOPS SSD (IO1) (SSD)
    # designed for I/O intensive applications (large RDB and NoSQL DB)
  # Throughput Optimized HDD (ST1) (magnetic)
    # big data, data warehouses, log processing, cannot be boot volume
  # Cold HDD (SC1) (magnetic)
    # lowest cost storage for infrequently accessed workloads (cannot be boot volume)
  # Magnetic (standard) (magnetic)
    # lowest cost per GB of all EBS volume types (ideal for infrequent access)


# ------------------
# EC2 practice
# ------------------

# US East (N Virginia) is where new services will be released first
# compute instances (EC2, Lightsail, elastic container service, lambda, batch, elastic beanstalk)

# create EC2
  # launch instance
  # choose AMI (Amazon Machine Image)
  # instance type (fightdrmcfx)
  # configure instance details
  # add storage
  # add tags
  # add security group (virtual firewall (kinda))
    # admin -- type (ssh), protocol (TCP), port range (22), source (anywhere (bad practice))
    # client -- type (http), protocol (TCP), port range (80), source (anywhere)
  # create key pair (public key -- lock, private key -- key)
    # services > ec2 > your ec2 instance
    # network & security > key pairs (https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html#having-ec2-create-your-key-pair)
    # name key pair
    # save key pair
  # view instance
  # connect
    # standalone ssh connection
    # in terminal -- 'chmod 400 myKeyPair.pem' (AWS will reject if too permissive)

# ------------------
# LOAD BALANCER
# ------------------

# spreads workload evenly to multiple servers

# types
  # application (OSI layer 7, http/https traffic)
  # network (OSI layer 4, tcp traffic, most expensive, best for production)
  # classic (layer 4 or 7, AWS prefers that you use the other 2)

# 504 error means the gateway has timed out (web/db server problem)

# client request -> load balancer -> EC2 instance
  # you can see the client's IPv4 address by parsing the X-Forwarded-For header

# ------------------
# REGISTER DOMAIN NAME (Route53)
# ------------------

# Route53 is Amazon's DNS service
# Route53 allows you to map domain names to the following:
  # EC2 instances
  # load balancers
  # S3 buckets (s3 -- simple storage service)

# using Route53
  # go to AWS console
  # services
  # Route 53 (Networking & content delivery)
    # DNS management
      # register domain
        # choose name/domain
        # check availability
        # add to cart
        # continue
        # contract details
      # create hosted zone
    # traffic management
      # EC2 dashboard
      # check running instances
      # left panel -- load balancers (load balancing)
      # choose load balancer (application)
      # configure load balancer (name, scheme, IP address type, listeners, zones)
      # assign security group
      # configure routing
        # new target group, name, protocol (http), port (80), target type (id or ip address)
        # health check -- protocol (http), path (/index.html)
        # register targets (add to registered group)
    # availability monitoring
    # domain registration
      # services
      # route53 (network and content delivery)
      # point DNS to load balancer (then click on link)
      # create record set (set alias target to load balancer)

# ------------------
# AWS CLI (docs -- docs.aws.amazon.com/cli/latest/index.html)
# ------------------

# using the CLI
  # log in to EC2 instance
  # ssh into EC2 instance (using public IP address & .pem file)
  # 'unable to locate credentials'
    # go to aws console > services > IAM
    # create new user (ie 'dev1') (give them programmatic access and/or console access)
    # create group for developers (ie 'devGroup') (policy type administrator access or system admin)
    # add user to group
    # IMPORTANT -- SAVE CREDENTIALS (DOWNLOAD CSV)
  # 'aws configure' command to configure credentials
  # enter access key, secret access key, region

# add stuff using the CLI
  # 'aws s3 ls' (hopefully no errors, just an empty dir)
  # make bucket (example) -- 'aws s3 mb s3://acloudguru1234-rk'
  # 'aws s3 ls' (see resulting bucket)
  # echo "hello cloud gurus" > hello.txt
  # ls
  # aws s3 cp hello.txt s3://acloudguru1234-rk
  # aws s3 ls s3://acloudguru1234-rk

# view s3 in AWS console
  # services > S3 (storage)
  # click on bucket
  # view files

# CLI tips
  # least privilege -- give users minimum amount of access required.
  # create groups -- create groups and add users to those groups
  # secret access keys -- only viewable once. if lost, delete/generate keys.
  # secret access keys -- keep private, dont share, dont push to github.

# ------------------
# EC2 with S3 Role Lab
# ------------------

# roles allow you to skip the Access Key ID & Secret Access Keys
# roles are preferred from a security perspective
# roles are controlled by policies
# change a policy on a role and it will take immediate effect
# you can attach/detach roles to running EC2 instances without having to stop/terminate instance

# give EC2 instance permissions (using a role) to interact with an S3 bucket
  # create role
    # log in to AWS console
    # services > IAM (security, identity, and compliance)
    # create role (entity -- aws service, service -- EC2)
    # attach permissions (administrator access is overkill, use AmazonS3FullAccess)
    # fill out name/description
  # apply role
    # services > compute > EC2
    # to check permissions, ssh into AWS and run command 'aws s3 ls'
      # should return 'InvalidAccessKeyId' error, unless user has permissions
    # apply role to EC2 instance (in AWS console)
      # actions > instance settings > Attach/Replace IAM Role
      # select role from IAM role dropdown (only EC2 roles will populate dropdown)
    # 'aws s3 ls' will list buckets
      # if InvalidAccessKeyId, 'cd ~/.aws' 'rm credentials' 'rm config'
    # 'aws s3 ls s3://acloudguru1234-rk' will show that bucket's contents
    # copy file to s3 bucket (example)
      # echo 'hello' > hello.txt
      # aws s3 cp hello.txt s3://acloudguru1234-rk

# ------------------
# RDS (relational db server)
# ------------------

# relational db types (on AWS)
  # SQL Server
  # Oracle
  # MySQL Server
  # PostgreSQL
  # Aurora (AWS) (compatible with MySQL)
  # MariaDB

# processing
  # OLTP -- online transaction processing (CRUD on a row) (simple, frequent transactions)
  # OLAP -- online analytics processing (analyze large groups of data) (complex, infrequent)

# Elasticache
  # caching frequently accessed information improves performance of web apps
  # supports two open-source in-memory caching engines -- memcached, redis
    # memcached -- objects
    # redis -- complex data types (lists, sets, I THINK)

# ------------------
# non-relational db
# ------------------

# non relational db types (on AWS)
  # DynamoDB

# ------------------
# S3 introduction
# ------------------

# s3 provides developers and IT teams with secure, durable, scalable object storage.
# s3 is easy to use, with a simple web services interface to store data.
# s3 is built for 99.99% availability (but it's guaranteed for 99.9% availability)
# s3 guarantees 99.999999999% durability (11 x 9s) (data-loss)

# object storage -- files, images, etc (not OS, not db)
# files can be 0 bytes to 5 TB
# files are stored in buttons
# s3 is a universal namespace -- bucket names must be unique globally
# after upload -- you will receive an HTTP 200 code if upload successful (api/CLI, not AWS console)

# Read after Write consistency -- new objects propogate quickly (puts)
# Eventual Consistency -- overwrites and deletes propogate slower (puts & deletes)

# s3 is object based -- they consist of keys/values
  # keys -- name of object
  # value -- data (sequence of bytes)
  # version ID -- several versions of a file
  # metadata -- data about the stored data
  # subresources -- bucket specific config (bucket policies, access control lists, CORS)

# storage tiers/classes (S3)
  # standard
  # standard_ia (infrequently accessed) (cheaper unless accessed frequently)
  # onezone_ia (only stored in one zone, 99.5% availability, 20% cheaper than s3-ia)
  # glacier (very cheap) (for archiving -- takes 3 to 5 hours to restore)

# s3 intelligent tiering (announced 11/2018)
  # frequent & infrequent access patterns
  # used >1 per month -- moved to frequent (and vice versa)

# charging
  # storage (per GB)
  # requests (get, put, copy, etc)
  # storage management (inventory, analytics, object tagging)
  # data transferred out of s3 (into s3 is free)
  # transfer acceleration (optimize file transfers/uploads)


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------


# ------------------
#
# ------------------
