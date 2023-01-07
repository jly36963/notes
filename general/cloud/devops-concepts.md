# DevOps

- traditional
  - workflow
    - development team makes application
    - operations team takes application and deploy it
  - problems
    - developers don't know about the server/environment
    - system administrators don't know anything about the app
    - devs implement change quickly. Ops avoid change to keep everything stable

- DevOps
  - use Dev, DevOps, and Ops teams

# CI / CD / continuous deployment

- CI (continuous integration)
  - the practice of frequently merging all developer work into a main code
    branch.
  - CI emphasizes automated testing to ensure new merged copy still works.
  - when code change is pushed, main code branch is automatically built and
    tested.
  - pipeline automation servers are used to implement automatic testing.
  - complex app architectures might need to be tested outside a local env
  - modern CI
    - testing code before merging is a way to ensure a clean main code branch.
    - ^^ this is a requirement for CD
  - requirements
    - common code repo that is accessible to all devs
    - main branch of code that changes are merged to
    - automated build/test of every change introduced

- CD (continuous delivery)
  - release code more often
  - ship changes to production frequently, in small increments
  - CD enables organizations to adapt to changing markets faster
  - IMPORTANT: app code in the main branch should be production deployable at
    all times
  - building blocks
    - comprehensive test coverage: unit, integration, functional
    - automated testing (CI) to keep mainline code clean
    - dev/test/prod envs should be as similar as possible
    - minimized config drift: everything as code (not manual)
    - deployment strategy that is repeatable, reliable, automated, has no down
      time.

- continuous deployment
  - extends CD. code changes are automatically deployed to production env
  - enables faster feedback loops
  - changes are generally small
  - requirements
    - confidence in CD pipeline
    - automated smoke tests (monitoring of prod env)
    - roll-back automation (or decision to fix forward)
    - business buy-in
  - blockers
    - regulatory environment
    - enterprise compliance
    - business requirements

- continuous improvement
  - incremental improvements in software delivery
    - application
    - environment
    - delivery pipeline
  - requires feedback mechanisms and metrics (built in to the process)
  - shorter feedback loops (allows for faster improvement)
  - metrics
    - mean time to change -- how long does a fix take, from inception to
      production delivery?
    - time to measured change -- how long does a fix take, from inception to
      measureable change?
    - deployment frequency -- how often is code released to production?
    - deployment lead time -- how long does it take from approval of change to
      production deployment
    - mean time to recovery -- how long does it take to recover from failures?
  - devops metrics post
    - https://stackify.com/15-metrics-for-devops-success/

# modern environments

- environments
  - infrastructure
  - server
  - supporting software

- problems
  - too few envs
    - leads to changes being queued for testing
  - envs are untsable
    - leads to delays when no environments are available for testing
  - envs are snowflakes
    - leads to uncertainty when there are major differences between environments

- on-demand environments
  - full automation enables delivery teams to provision their own environments
  - infrastructure as code and configuration management
  - requires integration with deployment pipeline tool
  - use cases:
    - automatic disposable environments for all feature branches
    - short lived environments per team (or environment per sprint)

- immutable environments
  - rebuild environments from scratch for every change (or every deployment)
  - requires full automation, abstraction of data storage

- autoscaling environments
  - every env is built identical
  - automatic scaling ensures environments can meet the demand
  - only feasible for horizontally scalable applications
  - requires testing of scaling logic

# team autonomy

- tools, not rules
  - do not create strict rules to limit delivery teams
  - acheive consistency through empowerment with tools, knowledge and context
  - provide boilerplates and automation tools to achieve critical tasks
  - upskill deliver teams to make the right choices (including asking for help)
  - provide context -- how do each of the pieces fit together?
  - in a regulated environment, design tooling/processes to accommodate

## DevOps teacher model

- change in mindset
  - from -- DevOps engineers own end-to-end CD pipelines
  - to -- DevOps specialists enable delivery teams to own their end-to-end CD
    pipelines

- steps toward this model
  - organize weekly sessions on relevant technologies
  - open a devops clinic
  - create feedback loops for continuous improvement
  - leverage devops evangelists

- devops teacher
  - coach -- upskill, coach, mentor delivery team on skills/competencies needed
    to own their CD pipeline
  - present -- participates in agile meetings, planning, retrospectives.
  - hands-on -- implements automation and tools to help delivery teams. helps
    the teams solve difficult problems.
  - shared -- can support multiple delivery teams, and can support more as teams
    mature and become autonomous
  - collaborative -- meets regularly with other teachers (where applicable)
  - temporary -- rotated between teams.

# cloud platforms

- AWS
  - largest provider of cloud IaaS
  - infrastructure building blocks: servers (EC2), storage disks (EBS), networks
    (VPC)
  - managed services: RDS, ECS, ElasticSearch service, SQS, SES, DynamoDB,
    Lambda
  - access: management console, CLI, API

- Azure
  - windows and linux VMs
  - native tools and managed services for .NET
  - modern managed services for serverless, AI, IoT, Blockchain
  - 42 regions
  - access: dashboard, CLI, API
  - integrated shell (bash or powershell)
  - ## services

- GCP
  - IaaS services:
    - VMs (Google Compute Engine)
    - storage (Google Cloud Storage)
    - virtual networks (VPC)
    - managed Kubernetes as a service (Google Container Engine)
  - many services for storing/procesing big data
  - access: web interface, command line (google cloud sdk) or API
  - Google cloud shell for command line on the cloud

- openstack
  - a cloud operating system that controls large pools of
    compute/storage/networking resources.
  - access: dashboard, CLI, REST API
  - IaaS services
    - nova -- computing engine
    - swift -- storage system (like s3)
    - cinder -- block storage (like fs)
    - neutron -- networking
    - horizon -- openstack dashboard
    - keystone -- openstack's identity services (permissions)
    - glance -- image services
    - ceilometer -- telemtetry services (metering and usage reporting)
    - heat -- orchestration component

# containers / orchestration

- docker
  - used to package applications (and deps) in a single, easily transportable
    container
  - isolated from host system. app containers should function identically
    accross different devices.
  - images -- holds a fs, can be shared by uploading into a registry
  - container -- instance of an image. contains a single process (and spawned
    child processes)

- kubernetes
  - container orchestration platform
  - run docker containers in production and at scale
  - manage: dashboard, CLI, API
  - configured with YAML / JSON
  - minikube for running test cluster locally
  - terms
    - pod -- basic unit of k8s. group of one or more containers on the same host
    - deployment -- a group of pods that can be updated and scaled up/down
    - service -- a connectivity abstraction in front of a deployment
      - group of pods with single IP address, often with LB
    - namespace -- an isolated 'virtual' k8s cluster running on a 'physical'
      cluster

- rancher
  - container orchestration platform
  - web interface
  - supports rancher cattle, k8s, docker swarm (orchestration engines)
  - application catalog for provisioning pre-configured app stacks
  - master/agent (host) setup
  - terms
    - service -- smallest deployment unit. consists of one or more containers.
      - number of containers in a single service can be scaled for
        performance/availability
    - stack -- group of services. can be optionally imported as a
      rancher-compose or docker-compose file.
    - host -- server running the rancher agent.
    - environment -- isolated unit with its own stacks/services/hosts.
      - a single rancher master can manage multiple envs running different
        container orchestration engines

- ECS (AWS elastic container service)
  - managed container orchestration platform
  - manages a fleet of EC2 VMs, runs containers on top of them according to
    specifications.
  - images must be in a registry (ECS supports docker hub and ECR)
    - ECR (elastic container registry) -- integrated docker registry for ECS
  - terms
    - tasks -- individual application components, consisting of one or more
      containers.
      - tasks are defined with JSON files (task definitions)
    - services -- manage tasks.
      - a service ensures that a desired number of tasks are running
      - optionally configures an AWS application LB for routing traffic into the
        tasks

# pipelines and automation

- jenkins -- automation server, often used for CI/CD
  - jenkins 2.0 -- interface improvements, pipeline as code
  - jenkinsfiles -- pipelines-as-code file
    - text file with list of steps for CI/CD pipeline
    - groovy-like syntax
  - master/slave model -- jenkins master can optionally delegate jobs to slaves

- gitlab
  - tool for managing software delivery
  - code repos, issue tracking, wiki pages, ToDo lists, docker registry, CI/CD
    pipeline automation
  - gitlab CI -- pipeline automation component. supports pipeline-as-code
    (gitlab-ci.yml)

- rundeck
  - application for building, running, scheduling automation workflows
  - run automations locally on rundeck server (or connect to a defined set of
    remote hosts to run tasks on)
  - implement automation for on-demand envs, deployments, data processing,
    backups, etc
  - often used for building self-service interfaces

# everything as code

- ansible
  - automation workflow tool:
    - configure servers
    - provision infrastructure
    - run series of tasks on a target
  - serverless and agentless
  - uses SSH to connect to target hosts to run tasks
  - written in python (target host requirement -- python)
  - terms
    - playbooks -- lists of tasks (yaml format).
      - they represent a desired config state, or a set of steps to achieve a
        desired goal (ie: deployment)
    - roles -- groups of tasks, variables, handlers in a known file structure.
    - modules / plugins -- extend Ansible functionality

- terraform
  - CLI tool for infrastructure as code
  - supports many IaaS/PaaS providers -- AWS, Azure, Heroku, GCP, Openstack
  - infrastructure specified in config files (*.tf)
  - modular; stateful

- chef
  - congifuration management tool
  - client/server model, can be run standalone
  - recipes and cookbooks written in Ruby. server written in Go
  - test kitchen -- powerful testing suite for chef
  - can also do infrastructure as code

- puppet
  - configuration management tool
  - uses custom declarative language (ruby based) to describe desired state of
    configuration
  - often used in master/agent model, can be run standalone
  - provides resource abstraction with Facter
  - terms
    - manifests -- puppet programs defining desired state of a component in a
      system.
      - text files written in the puppet declarative language (*.pp)
    - classes -- chunks of puppet code that can be called in manifests
    - modules -- collections of manifests and data such as templates.
