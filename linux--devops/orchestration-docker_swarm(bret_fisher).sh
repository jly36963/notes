# -------------
# docker swarm
# -------------

http://get.docker.com # script for installing docker (nice for swarm prep)

# -------------
# Swarm Intro and Creating a 3-Node Swarm Cluster
# -------------

## init
    # lots of PKI and security automation
        # root signing certificate created for swarm
        # certificate is issued for first manager node
        # join tokens are created (for nodes joining swarm)
    # raft database created to store root CA, configs, secrets
        # RAFT -- ensures consistency across nodes
            # raft concensus algorithm -- manager nodes implement this to manage global cluster state
        # encrypted by default on disk (1.13+)
        # no need for another key/value system to hold orchestration & secrets
        # replcates logs amongst managers via mutual TLS in "control plane"
# docker service create
    # manager node
        # API -- accepts command from client and creates service object
        # orchestrator -- reconciliation loop for service objects and creates tasks
        # allocator -- allocates IP addresses to tasks
        # scheduler -- assigns nodes to tasks
        # dispatcher -- checks in on workers
    # worker node
        # worker -- connects to dispatcher to check on assigned tasks
        # executor -- executes the tasks assigned to worker node

## Create Your First Service and Scale it Locally
docker info # info about docker (swarm: active) (default is inactive)
docker swarm init # swarm active, single node swarm
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
# swarm help
docker node --help
docker swarm --help
docker service --help
# services
docker service create alpine ping 8.8.8.8 # start service (ping google DNS server)
docker service ls # list services (id, name, mode, replicas, image)
docker service ps <service> # show tasks/containers (id, name, image, node, ...)
docker container ls # list containers (will have long, generated name)
docker service update <service_id> --replicas 3 # update to 3 replicas
docker service update --help # see all options
docker container rm -f <container-name> # remove container (swarm will replace)

## Creating a 3-Node Swarm Cluster

http://get.docker.com # script for installing docker

# play with docker
    # practice creating multi-node swarms 
    # resets after 4 hours
http://play-with-docker.com

# docker machine
    # must be installed -- https://docs.docker.com/machine/overview/
    # meant for automating dev/test, not a production tool
    # provision virtual machines locally, set up docker (default: virtualbox)
docker info # get info about docker
docker-machine # explanation
docker-machine create node1 # create node
docker-machine ssh node1 # ssh into node
docker-machine env node1 # outputs info about node, command to configure shell

# swarm
docker swarm init # swarm active
# advertise address
    # choose IP address to advertize swarm service on
docker swarm init --advertise-addr <ip_address> 
# add nodes
docker swarm join-token worker # get code used to add worker node (copy and run in new node)
docker swarm join-token manager # get code used to add manager node (copy and run in new node)
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
docker node update --role manager node2 # change from work node to manager node (can use swarm commands)
docker service create \
    --name <service_name> \
    --replicas 3 \
    alpine ping 8.8.8.8 # create service, give name, 3 replicas (spread evenly on 3 nodes), image, command
docker service ls # list services
docker node ps # list tasks running on one or more nodes (defaults to current node)
docker node ps node2 # list tasks running on node2
docker service ps <service_name> # list tasks on one or more services

## Scaling Out with Overlay Networking
    # multi-host networking
        # manage container-to-container traffic (inside a single swarm)
        # optional IPSec (AES) encryption on network creation
        # multiple networks can exist
        # each service can be connected to multiple networks
docker network create --driver overlay <network_name> # create overlay network
docker network ls # list networks
docker service create \
    --name psql \
    --network <network_name> \
    -e POSTGRES_PASSWORD="mypass" \
    postgres # create service on overlay network
docker service ls # list services (id, name, node, replicas, image)
docker service ps psql # list tasks on one or more services
docker container logs <container_name> # get logs of a container
docker service create \
    --name <service_name> \
    --network <network_name> \
    -p 80:80 
    <image> # create service on overlay network
docker service ls # list services (id, name, node, replicas, image)
watch docker service ls # (continually) list services
docker service ps <service_name> # list tasks on one or more services
docker service inspect <service_name> # detailed info on one or more services

# -------------
# Swarm Basic Features and How to Use Them In Your Workflow
# -------------

## Scaling Out with Overlay Networking
    # swarm routing mesh -- global traffic router
        # routes ingress (incoming) packets for a service to proper task
        # spans all nodes in swarm
        # uses IPVS from Linux Kernel
        # load balancing swarm services across their tasks
        # how this works:
            # container-to-container in an overlay network (uses VIP)
                # swarm puts VIP in front of all services (to distribute tasks)
                # VIP properly load balances across all tasks in a service
            # stateless load balancing
            # the LB is at OSI layer 3 (network) (TCP), not layer 4 (transport) (DNS)
                # use Nginx or HAProxy in front for layer 4 LB.
                # DEE comes with built-in level 4 proxy
            # external traffic incoming to published ports (all nodes listen)

## Scaling Out with Routing Mesh
docker service create --name search --replicas 3 -p 9200:9200 elasticsearch:2
docker service ps search # list tasks on one or more services

## Assignment Answers: Create a Multi-Service Multi-Node Web App
    # two overlay networks (frontend, backend)
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
docker service ls # # list services (id, name, node, replicas, image)
docker network create -d overlay backend # create network
docker network create -d overlay frontend # create network
docker service create \
    --name vote \
    -p 80:80 \
    --network frontend 
    --replicas 2 \
    <dockerhub_image>
docker service create \
    --name redis \
    --network frontend \
    --replicas 1 \
    redis:3.2
docker service create \
    --name worker \
    --network frontend \
    --network backend \
    <dockerhub_image>
docker service create \
    --name db \
    --network backend \
    --mount type=volume,source=db-data,target=/var/lib/postgresql/data \
    postgres:9.4
docker service create \
    --name result \
    --network backend \
    -p 5001:80 \
    <dockerhub_image>
docker service ls # list services (id, name, node, replicas, image)
docker service ps result # list tasks on one or more services
docker service ps redis 
docker service ps db 
docker service ps vote 
docker service ps worker 
docker service logs worker # fetch logs of service/task

## Swarm Stacks and Production Grade Compose
    # docker 1.13 -- stacks added
    # stacks accepts compose files (declarative definition for services/networks/volumes)
    # uses `docker stack deploy` (instead of `docker service create`)
    # stacks don't build. The images should be built and pushed to dockerhub
    # compose ignores deploy, swarm ignores build
docker stack deploy \
    -c example-voting-app-stack.yml \
    <stack_name> # start stack (compose)
docker stack # get commands
docker stack ls # list stacks
docker stack ps <stack_name> # list tasks in stack
docker container ls # list containers
docker stack services <stack_name> # list services in stack
docker stack ps <stack_name>
docker network ls # list networks
docker stack deploy \
    -c example-voting-app-stack.yml \
    <stack_name> # start stack (compose)

<<STACK
version: "3"
services:

  redis:
    image: redis:alpine
    ports:
      - "6379"
    networks:
      - frontend
    deploy:
      replicas: 1
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure
  db:
    image: postgres:9.4
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - backend
    environment:
      - POSTGRES_HOST_AUTH_METHOD=trust
    deploy:
      placement:
        constraints: [node.role == manager]
  vote:
    image: bretfisher/examplevotingapp_vote
    ports:
      - 5000:80
    networks:
      - frontend
    depends_on:
      - redis
    deploy:
      replicas: 2
      update_config:
        parallelism: 2
      restart_policy:
        condition: on-failure
  result:
    image: bretfisher/examplevotingapp_result
    ports:
      - 5001:80
    networks:
      - backend
    depends_on:
      - db
    deploy:
      replicas: 1
      update_config:
        parallelism: 2
        delay: 10s
      restart_policy:
        condition: on-failure

  worker:
    image: bretfisher/examplevotingapp_worker:java
    networks:
      - frontend
      - backend
    depends_on:
      - db
      - redis
    deploy:
      mode: replicated
      replicas: 1
      labels: [APP=VOTING]
      restart_policy:
        condition: on-failure
        delay: 10s
        max_attempts: 3
        window: 120s
      placement:
        constraints: [node.role == manager]

  visualizer:
    image: dockersamples/visualizer
    ports:
      - "8080:8080"
    stop_grace_period: 1m30s
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    deploy:
      placement:
        constraints: [node.role == manager]

networks:
  frontend:
  backend:

volumes:
  db-data:

STACK

## Secrets + Services
    # docker 1.13.0 -- swarm raft db is encrypted on disk
    # only stored on manager nodes
    # default is that managers/workers "control plane" is TLS + mutual auth
    # secrets are first stored in swarm, then assigned to a service(s)
    # only containers in assigned service(s) can see them
        # to view secret, open bash in a container and do `cat /run/secrets/<secret_name>`
    # secrets look like files in container but are actually in-memory fs (RAM fs)
    # docker-compose can use file-based secrets (not secure) (mounts secrets in clear text file into container)
docker secret create <secret_name> <secret_file>.txt # add secret (method 1) (from file)
echo "myDBpassWORD" | docker secret create psql_pass - # add secret (method 2) (from CLI input)
docker secret ls # list secrets (id, name, created, updated)
docker secret inspect <secret_name> # metadata of secret
docker service create \
    --name psql \
    --secret psql_user \
    --secret psql_pass \
    -e POSTGRES_PASSWORD_FILE=/run/secrets/psql_pass \
    -e POSTGRES_USER_FILE=/run/secrets/psql_user \
    postgres # create service, use secrets as env variables -- /run/secrets/<secret_name>
docker service ps psql # list tasks on one or more services
docker exec -it <container_name> bash
docker logs <container_name>
docker service update --secret-rm # remove secrets, re-deploy container (containers are immutable)

## Secrets + Stacks
    # compose version must be gte 3.1
docker stack deploy -c docker-compose.yml pg
docker secret ls # list secrets (id, name, created, updated)
docker stack rm pg # remove stack (clean up secrets)

## Using Secrets With Local Docker Compose
    # requires later versions of docker-compose 
    # file based secrets (can't use 'external')
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
docker-compose up -d # start compose
docker-compose exec psql cat /run/secrets/psql_user # compose (not secure) bind mounts secret into container

<<STACK
version: "3.1"
services:
  psql:
    image: postgres
    secrets:
      - psql_user
      - psql_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/psql_password
      POSTGRES_USER_FILE: /run/secrets/psql_user
secrets:
  psql_user:
    file: ./psql_user.txt
  psql_password:
    file: ./psql_password.txt
STACK

## Assignment Answers: Create A Stack with Secrets and Deploy
echo <secret_value> | docker secret create psql-pw - # create secret (CLI input)
docker stack deploy -c docker-compose.yml <stack_name> # start stack (using secret)
docker stack ps <stack_name> # list tasks in stack

<<STACK
version: '3.1'
services:
  drupal:
    image: drupal:8.2
    ports:
      - "8080:80"
    volumes:
      - drupal-modules:/var/www/html/modules
      - drupal-profiles:/var/www/html/profiles
      - drupal-sites:/var/www/html/sites
      - drupal-themes:/var/www/html/themes
  postgres:
    image: postgres:9.6
    environment:
      - POSTGRES_PASSWORD_FILE=/run/secrets/psql-pw
    secrets:
      - psql-pw
    volumes:
      - drupal-data:/var/lib/postgresql/data
volumes:
  drupal-data:
  drupal-modules:
  drupal-profiles:
  drupal-sites:
  drupal-themes:
secrets:
  psql-pw:
    external: true

STACK

# -------------
# Swarm App Lifecycle
# -------------

# compose files for:
    # local dev env (compose)
    # remote CI env (compose)
    # remote production env (stack)
# override
    # 'docker-compose.override.yml' -- must be exact name
    # only overrides 'docker-compose.yml' (`docker-compose up` command)
# multiple compose files
    # put base file first
        # earlier files will get overriden by later files
        # ie -- docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
    # config options will be merged
    # if conflict, config option in later compose files override previously defined option

## Full App Lifecycle: Dev, Build and Deploy With a Single Compose Design
docker-compose up -d # start docker-compose (default compose file) (detached)
docker inspect <name_or_id> # return low level info on docker objects
docker-compose down # stop docker-compose, remove containers/volumes/networks
docker-compose \
    -f docker-compose.yml \
    -f docker-compose.test.yml up -d # docker-compose up (multiple files)
docker-compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    config # alidate and view compose config (combine first if multiple files)
docker-compose \
    -f docker-compose.yml \
    -f docker-compose.prod.yml \
    config > output.yml # output validated/combined config to file

## Service Updates: Changing Things In Flight
    # update containers (will replace container for most changes)
    # limits downtime
    # many CLI options
    # healthcheck and rollback options
    # stack deploy (when pre-existing) will issue service updates
docker service create -p 8088:80 --name web nginx:1.13.7 # create service
docker service ls # list services
docker service scale web=8 api=6 # change number of replicas (multiple services)
docker service update --image nginx:1.13.6 web # update image
docker service update --publish-rm 8088 --publish-add 9090:80 # change ports
docker service update --env-add NODE_ENV=production # add env variable
docker service update --force <service_name> # force update (help even out node workloads)

## Healthchecks in Dockerfiles
    # healthcheck added in 1.12
    # supported by Dockerfile, run, compose, and swarm
    # docker engine will 'exec' command in the container
    # expects exit 0 (ok) or exit 1 (error)
        # MUST BE 0 OR 1
    # three states: starting, healthy, unhealthy
    # `docker run` takes no action based on healthchecks
        # healthcheck status shows up in `docker container ls`
        # check under `STATUS`. if started with healthcheck, the state will be shown
    # swarm services will replace tasks if they fail health check
    # Dockerfile health check
        # HEALTHCHECK curl -f http://localhost/ || false
        # HEALTHCHECK --interval=30s --timeout=3s CMD curl-f http://localhost/ || exit 1
docker run \
    --health-cmd="curl -f http://localhost/ || false" \
    --health-interval=15s \
    --health-retries=3 \
    --health-timeout=2s \
    --health-start-period=15s \
    <image> # run container, health command/interval/retries/timeout/start-period

# health check example (pg)
    # pg_isready -- postgres built in tool (check connection)
docker container run --name p1 -d postgres # run container (no health check)
docker container run --name p2 -d --health-cmd="pg_isready -U postgres || exit 1" postgres # with health check
docker container ls # list containers
docker container inspect p2 # metadata about container (look for `health` property)
docker service create --name p1 postgres # start postgres service (no health check)
docker service create --name p2 --health-cmd="pg_isready -U postgres || exit 1" postgres # with health check

<<COMPOSE
version: "3.1"
services:
  web:
    image: nginx
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 1m # version 3.4 minimum
COMPOSE


# -------------
# Controlling Container Placement in Swarm
# -------------

# by default, swarm service spreads its tasks out over nodes
    # tries to use the least-used node for a task
    # tries to disperse across nodes (fault tolerance)
# swarm has multiple ways to control which node a container runs on.
    # node labels & service constraints (<key>=<value>)
    # service modes (replicated, global)
    # placement preferences (spread)
    # node availability (active, pause, drain)
    # resource requirements (cpu, memory)

## Service Constraints
    # can filter task placement based on built-in or custom labels
    # can be added at create time, or added/removed at update time
    # creates a hard requirement, placement fails if not matched
    # supports multiple constraints
    # supports either `<key>` or `<key>=<value>`
    # can match with `==` or `!=`
    # labels can be node.labels or engine.labels
        # node.labels can only be added via manager to raft log
        # engine.labels added in daemon.json to any node {"labels":["dmz=true"]}
        # default to using node.labels, use engine.labels for autoscaling hardware, os
    # built in labels
        # node.id (listed in `docker node ls`)
        # node.hostname (listed in `docker node ls`)
        # node.ip
        # node.role (manager, worker)
        # node.platform.os (linux, windows, etc)
        # node.platform.arch (x86_64, arm64, 386, etc)
        # node.labels (custom labels, empty by default)
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
docker service create \
    --name app1 \
    --constraint node.role==worker \
    nginx # create service (constraint) (place only on worker node)
docker service update \
    --constraint-rm node.role==worker \
    --constraint-add node.role=manager \
    app1 # update service (constraint) (worker -> manager)
docker node update \
    --label-add dmz=true \
    node2 # update node (add label)
docker service create \
    --name dmz-nginx \
    --constraint node.labels.dmz==true \
    --replicas 2 \
    nginx # create service (constraint) (label)

## Service Mode
    # shown in `docker service ls`
    # can only be set on create (can't update)
    # replicated -- n replicas, spread across nodes. (default)
    # global -- one task per node (cannot specify replicas)
        # good for host agents (security, monitoring, backup, proxy, etc)
        # can be combined with constraints (put one on each node where <condition>)
docker service create \
    --mode=global \
    --name test1 \
    nginx # start service (global)
docker service ls # list services (id, name, mode, replicas, image, ports)
docker service rm test1 # remove service
docker service create \
    --mode=global \
    --name test1 \
    --constraint=node.role==worker \
    nginx # start service (global, only on worker nodes)

<<STACK
version: "3.1"
services:
  web:
    image: nginx
    deploy: 
      mode: global
STACK

## Service Placement Preference
    # soft requirement -- will do its best to meet preference
    # only one strategy (for now): "spread"
    # spread -- spread tasks among label values
        # example: zone:1, zone:2, zone:3 (spread evenly across label values)
        # good for ensuring distribution across availability zones, data centers, racks, subnets, etc.
    # works on create and update
    # can add multiple preferences for multi-later placement control
    # won't move service tasks if labels change
    # use with constraints if labels aren't on all nodes
        # missing label is a label with null value
docker node update --label-add azone=1 node1 
docker node update --label-add azone=2 node2
docker node update --label-add azone=2 node3 # add label to each node
docker service create \
    --placement-pref=spread=node.labels.azone \
    --replicas=2 \
    --name webapp1 \
    nginx # start service (placement preference, spread, azone label)
docker service create \
    --placement-pref=spread=node.labels.azone \
    --replicas=2 \
    --name webapp2 \
    nginx # start service (placement preference, spread, azone label)
docker service update \
    --placement-pref-rm spread=node.labels.azone \
    webapp1 # update service (remove spread placement preference)
docker service scale webapp2=8 # update service, (scale out -- more tasks)
docker service update \
    --constraint-add node.role==worker \
    webapp2 # update service (only place on worker nodes)

<<STACK
version: "3.1"
services:
  web:
    image: nginx
    deploy:
      placement:
        preferences:
          spread: node.labels.azone
STACK

## Node Availability
    # USE CONSTRAINTS INSTEAD (in production)
        # node availability is really only good for troubleshooting
    # only affects if existing or new containers can run on that node
    # each node can only have one of three admin-controlled states
        # active -- runs existing tasks, available for new tasks
        # pause -- runs existing tasks, NOT available for new tasks
        # drain -- reschedules existing tasks, NOT available for new tasks
    # remember that this affects service updates and recovering tasks too
    # use labels to control manager tasks
docker service create \
    --name webapp1 \
    --replicas 4 \
    nginx # start service
docker node update --availability=pause node2 # update node (pause)
docker service update --replicas=8 webapp1 # update service (replicas)
docker node update --availability=active node2 # update node (active)
docker node update --availability=drain node3 # update node (drain)
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
docker node update --availability=active node3 # update node (active)

## Service Resource Requirements
    # swarm -- set resource requirements at service create/update
        # docker run -- resource requirements work differently
    # controlled per-container
    # set for CPU and memory, reserving and limiting
    # beware of OOME (out of memory error)
        # OOME will result in killed container and subsequent reschedule
    # reservations are kind of loose
        # they prevent overscheduling. (if 4/4 CPUs are reserved, don't schedule more tasks)
    # overscheduling will prevent tasks from scheduling.
        # it will wait until something gives (could be forever if left alone)
    # values of 0 in service update mean "remove limit/reservation"
docker service create \
    --reserve-memory 800M \
    --name 800 \
    nginx # start service (reserve memory)
docker service create \
    --replicas 4 \
    --reserve-memory 300M \
    --name 300 \
    nginx # start service (reserve memory)
docker service update --reserve-memory 0 800 # update service (memory)
docker service create \
    --reserve-cpu 8 \
    --name 8 \
    nginx # create service (reserve CPU)
docker service ps 8 # list tasks of service
docker service create \
    --limit-memory 100M \
    --name 100 \
    bretfisher/stress:256m # start service (limit memory)
docker service ps 100 # list tasks of service

<<STACK
version: "3.1"
services:
  database:
  image: mysql
  deploy:
    resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '.5'
      memory: 500M
STACK

# -------------
# Operating Docker Swarm in Production
# -------------

# use a logging service instead
    # this is basically a placeholder for a real service

# log examples
docker service logs <service_name> # return all logs for service
docker service logs <task_id> # return all logs for task
docker service logs --raw --no-trunc <service_name> # get raw logs
docker service logs --tail 50 --follow <service_name> # get logs (50 past & all future lines)

## Service Logs: When To Use Them and Their Limits
docker stack deploy \
    -c example-voting-app-stack.yml \
    vote # start stack
watch docker stack services vote # list services in stack (continuously)
docker service ls # list services (id, name, mode, replicas, image, ports)
docker service logs <service_name> # get logs for a service (or task)
docker service ps <service_name> # list taks of one or more services
docker service logs <task_id> # get logs for a task (or service)
docker service logs --tail 5 --follow <service_name> # get logs (last 5 & all future entries)
docker service logs --tail 5 --raw --no-trunc <service_name> # get logs (last 5, raw)
docker service logs vote_worker 2>&1 | grep <search_term> # pipe logs into grep (redirect stdout/stderr)
docker service logs vote_worker 2>&1 | findstr <search_term> # windows close approximation of grep

## Docker Events and Viewing Them In Swarm
    # see what's happening in the swarm
    # "actions taken" logs of docker engine and swarm
        # ie -- network create, service update, container start
    # has searching/filtering/formatting capabilities
    # limited to last 1000 events
    # two scopes: local, swarm
docker service ls # list services (id, name, mode, replicas, image, ports)
docker events # show future events
docker events --since 2020-03-08 # show event since date and future events
docker events --since 1h30m # show event since time ago and future events
docker events \
    --since 1hr \
    --filter scope=swarm \
    --filter type=network # show events, filter based on scope AND type of action
docker service create --name nginx nginx # create service
docker service rm nginx # remove service
docker service create \
    --limit-memory=100M \
    --name 100 \
    bretfisher/stress:256m # create service (intentionally OOME) (watch events)
docker service rm 100 # remove service
docker service scale viz=1 # update service (scale)

## Using Swarm Configs To Save Time
    # map files/strings in raft log to any file path in tasks
    # ideal for config files (nginx, db, etc)
    # eliminates the need for custom images or bind-mount to host
    # similar to secrets (but can go anywhere in container)
    # immutable -- replace only, no updating
    # remobable once services are removed
    # strings saved to swarm raft log
    # private keys should still use secrets
docker stack deploy -c example-voting-app-stack.yml vote # start stack
docker config create vote-nginx-20171211 ./nginx-app.conf # create config from file or STDIN
docker config ls # list configs (id, name, created, updated)
docker service create \
    --config source=vote-nginx-20171211,target=/etc/nginx/conf.d/default.conf \
    -p 9000:80 \
    --network vote_frontend \
    --name proxy \
    nginx # create service (config)
docker config inspect vote-nginx-20171211 # display detailed info on configs
docker service inspect proxy # display info on services
docker config rm vote-nginx-20171211 # remove config (will be blocked if used by a service)
docker config create vote-nginx-20171212 ./nginx-app.conf # create config
docker config ls # list configs (id, name, created, updated)
docker service update \
    --config-rm vote-nginx-20171211 \
    --config-add source=vote-nginx-20171212,target=/etc/nginx/conf.d/default.conf \
    proxy # service update (rm old config, add new)

<<STACK
version: "3.3" # 3.3 or higher required
services:
  web:
    image: nginx
    configs:
      - source: nginx-proxy
        target: /etc/nginx/conf.d/default.conf
configs:
  nginx-proxy:
    file: ./nginx-app.conf
STACK


# -------------
# Limit Downtime with Rolling Updates, Healthchecks and Rollbacks
# -------------

### HERE HERE HERE

## Testing Rolling Service Updates
docker network create \
    --driver overlay \
    --attachable verse
docker service create \
    --name firefly -p 80:80 \
    --network verse \
    --replicas 5 bretfisher/browncoat:v1
docker run \
    --rm \
    --network verse bretfisher/httping -i .1 -GsY firefly/healthz
docker service update \
    --image bretfisher/browncoat:v2 firefly
docker service update \
    --env-add DELAY_STARTUP=5000 firefly
## Assignment ANSWERS: Try Update Options
docker events -f service=firefly
docker network create --driver overlay --attachable verse
docker service create \
    --name firefly -p 80:80 \
    --network verse \
    --replicas 5 \
    --constraint "node.hostname==node1" 
    bretfisher/browncoat:v1
docker node ls
docker service update --update monitor 15s firefly
docker service inspect --pretty firefly
docker service scale firefly=15
docker service update --update-parallelism 5 --force firefly
docker service scale firefly=1
docker service update --update-order start-first firefly
docker events -f service=firefly
docker service ps firefly
docker events -f service=firefly
docker service update --force firefly
docker service inspect --pretty firefly
docker service update --force firefly
## Testing Updates with Healthchecks
docker network create --driver overlay --attachable verse
docker service create \
    --name firefly -p 80:80 \
    --network verse \
    --replicas 5 \
    --constraint "node.hostname==node1" bretfisher/browncoat:v1
docker run \
    --rm \
    --network verse bretfisher/httping -i .1 -GsY firefly/healthz
docker events -f service=firefly
docker service update \
    --image bretfisher/browncoat:v2 firefly
docker service update \
    --image bretfisher/browncoat:healthcheck firefly

https://github.com/docker-library/healthcheck
## Assignment ANSWERS: Use Healthchecks with Rolling Updates
docker run -d --name es2 elasticsearch:2
docker exec -it es2 bash
docker rm -f es2
docker run -d --name mongo
docker exec -it mongo bash
docker --quiet localhost/test --eval 'quit(db.runCommand({ping: 1}).ok ? 0 : 2)'
docker run -d --name redis redis
docker exec -it redis bash
https://github.com/bretfisher/node-docker-good-defaults
## Testing Update Failures with Rollbacks
docker service create --name firefly --replicas 3 bretfisher/browncoat:healthcheck
docker service update --image bretfisher/browncoat:v3.healthcheck firefly
docker service ps firefly
docker service rollback firefly
docker service ps firefly
docker service update --image bretfisher/browncoat:v3.healthcheck --update-failure-action rollback firefly
docker service ps firefly
## Assignment ANSWERS: Add Healthchecks and Updates on Voting App
watch docker stack ps vote



# -------------
# Container Registries: Image Storage and Distribution
# -------------

## Docker Hub: Digging Deeper
    # most popular public image registry
    # Docker Registry + lightweight image building
    # private -- 1 free private, rest are paid
    # permissions -- you have permissions to your own images
        # collaborators -- can give permissions to collaborators
    # CI
        # webhooks -- docker has webhooks for notifying other services after push.
        # create automated build -- "reverse webhook". docker hub will build when notified by other services
        # repo links -- link automated build to another docker hub registry (build when dependencies change)
        # build trigger -- specific API endpoints (POST) that trigger builds
https://hub.docker.com

# docker registry (local)
    # private image registry for your network
    # de facto leader in private container registries
    # API, not GUI. basic auth only
    # supports local and cloud storage
    # to do
        # secure registry with TLS -- docker won't talk to registry without HTTPS (except localhost)
        # enterprise version would need tools on top of it (for administration/scalability)
        # storage cleanup (garbage collection) -- reduce storage space needed
        # proxy mode (registry mirror) -- docker daemon will cache hub images in registry 
https://hub.docker.com/_/registry

# managing local registry images
docker container run -d \
    -p 5000:5000 \
    --name registry \
    -v $(pwd)/registry-data:/var/lib/registry \
    registry # start registry container
docker tag <image> 127.0.0.1:5000/<image> # tag
docker push 127.0.0.1:5000/<image> # push
docker pull 127.0.0.1:5000/<image> # pull
docker image remove 127.0.0.1:5000/<image> # remove (?)

## Docker Store: What Is It For?
https://store.docker.com

## Docker Cloud: CI/CD and Server Ops
https://cloud.docker.com
https://hub.docker.com

## Understanding Docker Registry
https://github.com/docker/distribution
https://hub.docker.com/registry

## Run a Private Docker Registry
docker container run -d -p 5000:5000 --name registry registry # run registry container (no volume)
docker container ls # list containers
docker image ls # list images
docker pull hello-world # pull image
docker run hello-world # run image
docker tag hello-world 127.0.0.1:5000/hello-world # re-tag
docker image ls # list images
docker push 127.0.0.1:5000/hello-world # push to local registry
docker image remove hello-world # remove image
docker container rm <container_name> # remove container
docker image remove 127.0.0.1:5000/hello-world # remove image
docker image ls # list images
docker pull 127.0.0.1:5000/hello-world:latest # pull image from local registry
docker container kill registry # kill registry container
docker container rm registry # remove container
docker container run -d \
    -p 5000:5000 \
    --name registry \
    -v $(pwd)/registry-data:/var/lib/registry \
    registry # start registry container (with volume)
docker image ls # list images
docker push 127.0.0.1:5000/hello-world # push image to local registry

## Using Docker Registry With Swarm
http://play-with-docker.com
docker node ls # list nodes (id, hostname, status, availability, manager status, engine version)
docker service create --name registry --publish 5000:5000 registry # start local registry container
docker service ps registry # show tasks/containers (id, name, image, node, ...)
docker pull hello-world # pull image
docker tag hello-world 127.0.0.1:5000/hello-world # re-tag
docker push 127.0.0.1:5000/hello-world # push to local registry
docker pull nginx # pull image
docker tag nginx 127.0.0.1:5000/nginx # re-tag
docker push 127.0.0.1:5000/nginx # push to local registry
docker service create \
    --name nginx \
    -p 80:80 \
    --replicas 5 \
    --detach=false \
    127.0.0.1:5000/nginx # create service using image from local registry (show initial process)
docker service ps nginx # show tasks/containers (id, name, image, node, ...)

# alternative registries
    # quay.io
    # AWS / Azure / Google Cloud
    # enterprise
        # Docker EE, Quay Enterprise, Gitlab Container Registry