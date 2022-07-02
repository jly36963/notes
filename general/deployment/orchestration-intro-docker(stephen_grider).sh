# ------------
# DOCKER
# ------------

# ------------
# HIGHLIGHTS
# ------------

# info
docker ps # list running containers
docker ps --all # list all created containers
docker image ls
docker container ls
docker network ls
docker volume ls
docker volume inspect volume_name
ps aux | grep node # see all processes (only show lines with 'node')
docker system df --verbose # docker disk usage 

# remove
docker system prune -f # remove containers, images, networks
docker network prune -f 
docker image prune -f
docker container prune -f

# start/build
docker run image_name # run container (create + start)
docker exec -it container_id my_command # execute command in running container
docker exec -it container_id sh # open bash shell in running container
docker container start my_container # start existing container (use id or name)
docker build . # run Dockerfile in current directory
docker run container_id # run newly created image (id provided in previous output)
docker build -t stephengrider/redis:latest . # tag container-- stephengrider/redis
docker run -p 3000:3000 jly36963/simpleweb # port mapping (local:container)

# docker compose
docker-compose up --build # build using 'docker-compose.yml' file in current dir
docker-compose ps # get status of containers specified in .yml (troubleshooting)
docker stats # application performance monitoring (cpu and memory)
docker stats image_name # apm for specific image
docker-compose -f docker-compose.dev.yml up --build # use alternate docker-compose file

# docker compose (detached)
docker-compose up --build -d # start (detached)
docker-compose stop # stop

# ------------
# HIGHLIGHTS 2
# ------------

# info
docker container ls # list running containers
docker container ls -a # list all containers
docker images # list images
docker images -aq # list images (all, quietly -- only IDs)
docker network ps -q # all networks (only id)


# remove
docker container stop $(docker ps -a -q) # stop all running containers
docker container kill $(docker ps -q) # kill all running containers
docker rm $(docker ps -aq) # remove all containers
docker container rm $(docker ps -a -q) # remove all non-running containers
docker image rm $(docker images -a -q) # remove all images
docker network rm $(docker network ls -q)
docker volume rm $(docker volume ls -q)

docker rmi $(docker images -q) # remove all images

# start/build
docker image build -t my_repo/my_image:my_tag . # build image with tag
docker image push my_repo/my_image:my_tag # push image to remote registry
docker container run -it -p 1000:8000 # create & start image (flags -- interactive, ports)
docker build -f Dockerfile.dev . # specify dockerfile that isn't named 'Dockerfile'

# docker compose
docker-compose up --build # build using 'docker-compose.yml' file in current dir
docker-compose ps # get status of containers specified in .yml


# ------------
# DOCKER CE
# ------------

# download and run test container (hello world)
sudo docker run hello-world

# docker version
docker version

# ------------
# DOCKER COMPOSE
# ------------

# install (linux) (docker compose)
# https://docs.docker.com/compose/install/#install-compose

# test installation
docker-compose -v

# ------------
# RUN WITHOUT SUDO
# ------------

# https://docs.docker.com/install/linux/linux-postinstall/#manage-docker-as-a-non-root-user

# ------------
# START ON BOOT
# ------------

# https://docs.docker.com/install/linux/linux-postinstall/#configure-docker-to-start-on-boot

# ------------
# RUN CONTAINER FROM AN IMAGE (create + start)
# ------------

docker run image_name # run container (create + start)
docker run image_name override_command # run with override command

docker create image_name # create container
docker start container_id # start container
docker start -a container_id # start container, show output from container

# ------------
# STOP/KILL CONTAINER
# ------------

docker stop container_id # stop properly (allow grace period before stopping)
docker kill container_id # stop immediately (no grace period)

# docker will eventually fallback to a 'kill' command
# if 'stop' command doesn't do anything.

# ------------
# REMOVE STOPPED CONTAINERS
# ------------

docker system prune # removes stopped containers (and a few other things)

# ------------
# LIST RUNNING CONTAINERS
# ------------

docker ps # list running containers
docker ps --all # list all created containers

# ------------
# SHOW OUTPUT (from docker start)
# ------------

# method 1
docker start -a container_id # start container, show output from container
# method 2
docker start container_id # start container
docker logs container_id # get logs


# ------------
# EXECUTE COMMAND IN RUNNING CONTAINER
# ------------

# execute command inside of container
# containers have STDIN, STDOUT, STDERR
# `-i` connects to the STDIN of the container process
# `-t` prettifies output (formats nicely) (simplified explanation)
docker exec -it container_id my_command


# ------------
# RUN SHELL IN CONTAINER (bash, powershell, zsh, sh)
# ------------

# open unix/shell terminal inside container
docker exec -it container_id sh

# ------------
# CREATE DOCKER IMAGE
# ------------

# Dockerile -> Docker Client (CLI) -> Docker Server -> Usable Image
# Dockerfile
  # specify base image
  # install additional programs
  # specify startup command

docker build . # run Dockerfile in current directory
docker run container_id # run newly created image (id provided in previous output)

# ------------
# DOCKERFILE ('Dockerfile') (Redis example)
# ------------

# build process (simplified)
  # create image
  # create temporary container, modify container's FS, save image (FS snapshot)
    # if next step, save as temporary image.
    # if no next step, save image as output.

# Use an existing docker image as a base
FROM alpine
# Download and install a dependency
RUN apk add --update redis
# Tell the image what to do when it starts as a container
CMD ["redis-server"]

# build process (specific to this example)
  # STEP 1
  # creates alpine image
  # STEP 2
  # creates temporary (intermediate) container for image
  # executes dependency install process inside container
  # creates temporary image from container, removes intermediate container
  # STEP 3
  # creates temporary container for image
  # preconfigures image with startup command (primary process)
  # saves snapshot of container as new image
  # removes temporary container

# ------------
# TAGGING IMAGES
# ------------

# tagging
  # run build command with tag
  # run container (with docker id / project name) (not container id)

# docker build -t docker_id/project_name:version context
docker build -t stephengrider/redis:latest . # tag -- stephengrider/redis

# ------------
# ID SHORTCUT
# ------------

# when using a docker id in a command, you can use a handful of leading chars.
docker run 193847a43e # kind of like autocomplete
docker run 193847a43ea8913419384798ea5cb19387419

# ------------
# USING LOCAL FILES (inside container)
# ------------

# copy files from build directory to container's directory
COPY ./ ./ # can also be 'COPY . .'

# set working directory
WORKDIR /usr/app

# ------------
# CONTAINER PORT MAPPING (by default, container won't receive local incoming requests.)
# ------------

# route incoming requests (local_port:container_port)
docker run -p 3000:3000 jly36963/simpleweb

# ------------
# DOCKER + NODE.JS (web app)
# ------------

# create .dockerignore file to keep docker from copying .git & node_modules
# docker (by default) doesn't receive incoming requests. (port mapping required)
  # port forwarding happens during 'docker run' command.

## Dockerfile
# specify base image (FROM image:tag) (ie -- FROM node:10.15)
FROM node:alpine
# run some commands to install additional programs
WORKDIR /usr/app # set working directory
COPY ./package.json ./ # copy package.json
RUN npm install # uses cache unless package.json changed (saves time)
COPY ./ ./ # copy everything else
# specify a command to run on container startup
CMD ["npm", "start"]

## Build commands (create Dockerfile in root of project directory. run commands in terminal)
# build
docker build -t jly36963/simpleweb .
# run image (route incoming requests) (local_port:container_port)
docker run -p 3000:3000 jly36963/simpleweb
docker exec -it jly36963/simpleweb sh # use shell inside conainer

# ------------
# DOCKER COMPOSE
# ------------

# docker-compose will create network between containers used

# docker-compose uses a .yml file
  # version -- version of docker-compose to use.
  # services -- types of containers used.
    # image -- base image
    # build -- Dockerfile to use in build
    # ports -- route incoming requests
      # '-' -- signifies array
    # restart -- specifies the restart policy to be used (on container stop)
      # "no" -- never restart
      # always -- always restart
      # on-failure -- restart if error code
      # unless-stopped -- restart unless deliberately stopped

# example 'docker-compose.yml' file
version: '3'
services:
  redis-server:
    image: 'redis'
  node-app:
    build: .
    restart: always
    ports:
      - "3000:3000"

# build & run container (using docker-compose)
docker-compose up --build # build using 'docker-compose.yml' file in current dir
# run container (no build)
docker-compose up

# launch in background
docker-compose up -d
# stop containers
docker-compose down

# container status
  # gets status of containers specified in docker-compose.yml (current dir)
docker-compose ps

# ------------
# ------------
# DEVELOPMENT WORKFLOW (dev, test, deploy) (docker + AWS)
# ------------
# ------------

# github/deployment workflow
  # pull from feature branch
  # make changes
  # push back to feature branch
  # create pull request to master branch
  # set up testing service
  # if test successful, automatically deploy to AWS

# create 'Dockerfile.dev' (development)
FROM node:alpine # base image
WORKDIR '/app' # working dir
COPY package.json . # copy package.json to container
RUN npm install # install dependencies
COPY . . # copy everything else to container
CMD ["npm", "run", "start"] # default command on container startup

# build (development)
  # uses custom filename for 'Dockerfile', creates tag.
docker build -f Dockerfile.dev -t jly36963/docker-cra .

# run container (without volumes)
docker run -p 3000:3000 jly36963/docker-cra

# run test (better approach later)
docker exec -it jly36963/docker-cra npm run test

# ------------
# VOLUMES (dev workflow continued)
# ------------

# run container (with volumes) (maps local folders to container folders)
# volumes usage
  # 1 -- bookmark the container's 'node_modules' folder
    # don't reference back, leave it alone
  # 2 -- map the 'pwd' into the '/app' folder
    # local:container
docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app jly36963/docker-cra

# ------------
# DOCKER-COMPOSE (with volumes) (dev workflow continued)
# ------------

# THE POINT OF VOLUMES
  # if you want the container to automatically reflect code changes, use volumes

# docker-compose.yml
  # volumes (line 1) -- bookmark 'node_modules' (don't reference, leave alone)
  # volumes (line 2) -- map the current dir into the container's '/app' folder
version: '3'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm" "run" "test"]

# build/run containers (using docker-compose)
docker-compose up --build # build using 'docker-compose.yml' file in current dir

# ------------
# MULTI-STEP DOCKER BUILDS (react + nginx)
# ------------

# build phase
  # use 'node:alpine' (base image)
  # copy 'package.json' file
  # install dependencies
  # run 'npm run build'
# run phase
  # use nginx
  # copy build (from the result of 'npm run build')
  # start nginx

# Dockerfile
  # 'npm run build' will create 'build' dir (/app/build)
  # 'as builder' specifies phase
  # '--from=builder' pull something from the 'builder' phase
  # 'usr/.../html' serve static content (nginx dockerhub docs))
  
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html

# build/run container
docker build -t jly36963/nginx-cra .
docker run -p 3000:80 jly36963/nginx-cra

# ------------
# MULTI-CONTAINER APPLICATION (development)
# ------------

# nginx (server), react (frontend), express (backend api), pg (db), and redis (in mem caching)

# he set up the server/worker CMDs as 'npm run dev' ("dev": "nodemon")
# another alternative (concurrently):
  # "server": "nodemon server.js",
  # "client": "npm start --prefix client",
  # "dev": "concurrently \"npm run server\" \"npm run client\"",

# docker-compose can be used to specify environment variables (process.env.PGUSER)
  # two syntaxes
    # variableName=value (taken from docker?)
    # variableName (taken from computer?)

# info on postgres and redis images can be found on docker hub

# nginx -- nginx will route requests depending on structure ('/api/' or '/')
  # nginx needs 'default.conf' file

# app
  # client
    # public
    # src
  # nginx
  # server ('api' service in 'docker-compose.yml' file)
  # worker

# app/docker-compose.yml
version: '3'
services:
  postgres:
    image: 'postgres:latest'
  redis:
    image: 'redis:latest'
  api:
    build: 
      dockerfile: Dockerfile.dev
      context: ./server
    volumes:
      - /app/node_modules 
      - ./server:/app
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - PGUSER=postgres
      - PGHOST=postgres
      - PGDATABASE=postgres
      - PGPASSWORD=postgres_password
      - PGPORT=5432
  client: 
    build:
      dockerfile: Dockerfile.dev
      context: ./client
    volumes:
      - /app/node_modules
      - ./client:/app
  worker:
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    build:
      dockerfile: Dockerfile.dev
      context: ./worker
    volumes:
      - /app/node_modules
      - ./worker:/app
  nginx:
    restart: always
    build:
      dockerfile: Dockerfile.dev
      context: ./nginx
    ports:
      - '3050:80'

# build/run containers (using docker-compose)
docker-compose up --build # build using 'docker-compose.yml' file in current dir

# app/client/Dockerfile.dev
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# app/server/Dockerfile.dev
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# app/worker/Dockerfile.dev
FROM node:alpine
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# app/nginx/Dockerfile.dev
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf


# ------------
# MULTI-CONTAINER APPLICATION (production)
# ------------

# app/worker/Dockerfile
# same as .dev, except
CMD ["npm", "run", "start"]

# app/server/Dockerfile
# same as .dev, except
CMD ["npm", "run", "start"]

# app/nginx/Dockerfile
# same as .dev

# app/client/Dockerfile
FROM node:alpine as builder 
WORKDIR '/app'
COPY package.json ./
RUN npm install
COPY . . 
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html  

# client/nginx/default.conf (production nginx config -- to serve build)
server {
    listen 3000;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
    }
}

# app/Dockerrun.aws.json
  # amazon EB, amazon ecs task definitions, task definition parameters, container definitions  
  # name can be customized
  # images should be pushed to docker hub. ("image": "user/image")
  # hostname -- a way for other containers to access this container
  # essential -- when true: if this contaier crashes, shut down other containers.
    # at least one must be marked as essential
  # memory -- memory allocation in MBs. do some research to figure out good values.
{
  "AWSEBDockerrunVersion": 2,
  "containerDefinitions": [
    {
      "name": "client",
      "image": "stephengrider/multi-client",
      "hostname": "client",
      "essential": false,
      "memory": 128
    },
    {
      "name": "worker",
      "image": "stephengrider/multi-worker",
      "hostname": "worker",
      "essential": false,
      "memory": 128
    },
    {
      "name": "server",
      "image": "stephengrider/multi-server",
      "hostname": "api",
      "essential": false,
      "memory": 128
    },
    {
      "name": "nginx",
      "image": "stephengrider/multi-nginx",
      "hostname": "nginx",
      "essential": true,
      "memory": 128,
      "portMappings": [
        {
          "hostPort": 80,
          "containerPort": 80
        }
      ],
      "links": ["client", "server"],
      "memory": 128
    }
  ]
}

# create EB environment (aws)
  # postgres -- aws relational database service (RDS)
  # redis -- aws ElastiCache
  # virtual private cloud (vpc) -- each EB instance is provisioned a VPC (for each region)
  # create security group
    # default security group (for this project) allows incoming traffic on port 80 (from any IP)
    # create security group that allows services with the same security group to communicate
    # assign security group to EB/postgres/redis, in order to allow traffic between them
  # create RDS database
    # aws > services > rds
    # scroll down, 'create database' button.
    # select postgres
    # set instance specifications
      # set db identifier, master username, master password
    # configure advanced settings
      # network & security -- choose Default VPC, set public accessibility to 'no', create new VPC
      # db options -- db name, port
  # create ElastiCache instance
    # aws > services > elasticache > redis > create
    # redis settings -- name, num of replicas (none), node-type (expensive default, change to t2.micro)
    # advanced redis settings -- subnet name, vpc id
  # create new security group
    # aws > vpc dashboard > security groups > create security group
    # name, group name, description, vpc
    # once created, select security group. add inbound rule
      # leave defaults. source -- choose security group. (members of this security group can communicate with each other)
      # assign security group to each service (EB, RDS, EC)
        # services > EC -- modify cluster, add vpc security group
        # services > RDS instances > scroll to 'details' > modify > network & security > add security group
        # services > EB > configuration > instances/modify > EC2 security groups. check security group
  # environment variables
    # services > EB > config > software/modify
    # add names/values under 'environment properties' to add env variables
      # EC dashboard > select instance > dropdown arrow to see 'primary endpoint'.
        # this is the connection string for redis. (don't copy port)
      # RDS > instances > scroll to 'connect'. copy 'endpoint'
  # create IAM user (for deploying to aws)
    # IAM > users > add user
    # name, programmatic access
    # attach existing policies directly, choose policy
    # create user
    # IMPORTANT: get csv of user, access key id, and secret access key. this is only shown once.

# troubleshooting AWS
  # EB > EB instance > logs > last 100 lines
  # the logs will have useful information (in case of problems)

# open application
  # EB > EB instance > Dashboard > url should be listed

# ------------
#
# ------------



# ------------
#
# ------------



# ------------
# 
# ------------



# ------------
#
# ------------



# ------------
#
# ------------



# ------------
#
# ------------



# end
