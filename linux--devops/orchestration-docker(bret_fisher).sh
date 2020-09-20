

## Docker for Windows 10 Pro/Ent: Setup and Tips
docker version # version
docker ps # processes (containers) running
docker info # lots of details
docker # list of commands
# management commands (incomplete)
docker system
docker image
docker container
docker network
docker volume
docker swarm

## Docker for Linux Setup and Tips
docker
http://get.docker.com
curl -fsSL get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker bret
sudo docker version
docker version
sudo docker version
docker-machine version
http://github.com/docker/compose
http://github.com/docker/compose/releases
curl -L https://github.com/docker/compose/releases/download/1.15.0/docker-compose- `uname -s `- `uname -m` >/usr/local/bin/docker-compose
docker-compose version
http://github.com/docker/machine/releases
http://github.com/BretFisher/udemy-docker-mastery
git clone https://github.com/Bretfisher/udemy-docker-mastery.git
cd udemy-docker-mastery/
docker image
docker image ls --

# Creating and Using Containers Like a Boss

# docker container run
    # look for image locally
    # look for remote image repo (dockerhub)
    # downloads latest version (unless version specified)
    # creates new container based on image
    # gives virtual IP on private network inside docker engine
    # opens up exposed ports (must be specified)

## Starting a Nginx Web Server
docker container run --publish 80:80 nginx # run container port 80
docker container run --publish 80:80 --detach nginx # run container, port 80, detached
docker container run --publish 80:80 --detach --name containerName nginx # give name
docker container ls # list running containers
docker container ls -a # list all containers
docker container logs <containerName> # get logs from container
docker container top <containerName> # running processes in container
docker container stop <container_id> # stop running container
docker container rm <container_id> # remove stopped container (can list multiple)
docker container rm -f <container_id> # force remove (remove running container)

## Container VS. VM: It's Just a Process
ps aux # show all running processes
docker run -d <image> --name <container_name> # start container
docker ps # running containers (processes)
docker top <container_name> # list processes inside
docker stop <container_name> # stop container
docker start <container_name> # start container


## Assignment Answers: Manage Multiple Containers
docker container run -d \
    -p 3306:3306 \
    --name mysql \
    -e MYSQL_ROOT_PASSWORD="my-secret-pw" \
    mysql # detached, port, container name, env variables, image 
docker container logs db
docker container run -d --name webserver -p 8080:80 httpd # apache / httpd
docker container run -d --name proxy -p 80:80 nginx # nginx (proxy)
docker container ls # list running containers
docker container stop <container_id>
docker ps -a # list (all) containers
docker container ls -a # list (all) containers
docker container rm <container_id> # remove stopped container
docker image ls # list images

## What's Going On In Containers: CLI Process Monitoring
docker container run -d --name nginx nginx
docker container ls
docker container top nginx # process list in container
docker container inspect nginx # details of container config
docker container stats # performance stats for all containers
docker exec -it <container_name> /bin/bash # open shell in linux container
docker container ls # list running containers

## Getting a Shell Inside Containers: No Need for SSH
    # i -- interactive, t -- allocate pseudo-TTY
docker exec -it <container_name> /bin/bash # open shell in running linux container
docker container run -it <image> bash # start container interactively

## Docker Networks: Concepts for Private and Public Comms in Containers
    # each container is connected to a private virtual network "bridge"
    # each virtual network routes through NAT firewall on host IP
    # containers on the same virtual network can communicate freely
    # best practice -- create virtual network for each app
    # containers will have a different IP address than their host
docker container port <container_name> # ports exposed
docker container inspect --format '{{ .NetworkSettings.IPAddress }}' webhost # IP

## Docker Networks: CLI Management of Virtual Networks
    # bridge -- default docker virtual network. NATed behind host IP
    # host -- host network (connecting to this will decrease security but increase throughput)
    # none -- local-only network
docker network ls # list networks
docker network inspect <network_name> # inspect a network
docker network create <network_name> # create a virtual network 
docker network connect <network_id> <container_id> # attach a network to a container
docker network disconnect <network_id> <container_id> # detach a network from a container
docker container run -d --name <container_name> --network <network_name> # run, connect to network

## Docker Networks: DNS and How Containers Find Each Other
    # IP addresses are too dynamic. container names are static.
    # docker daemon has a built-in DNS server (containers use by default)
    # docker uses container names when containers communicate with each other.
docker container ls # get container names

# Round Robin DNS
    # Round Robin DNS
        # technique of load distribution, load balancing, and/or fault-tolerance.
        # multiple hosts with DNS aliases that respond to the same DNS name
        # respond to DNS requests with multiple potential IP addresses (corresponding to servers)
    # network alias
        # docker uses network aliases to give an additional DNS name to respond to

docker network create <network>
docker container run -d --net <network> --network-alias <alias> <image>

# Container Images, Where To Find Them and How To Build Them

# images
    # image -- ordered collection of root fs changes, corresponding exec params.
    # image -- app binaries, dependencies, metadata about the image data and running the image

## The Mighty Hub: Using Docker Hub Registry Images
    # official -- docker has a team that manages the image. usually collabs with software owner
http://hub.docker.com
docker pull nginx # pull latest
docker pull nginx:1.11.9 # pull using tag (specified version)
docker image ls

## Images and Their Layers: Discover the Image Cache
docker image ls # list images
docker history <image> # show image changes/layers
docker image inspect <image> # returns JSON metadata about the image

## Image Tagging and Pushing to Docker Hub
    # image name -- registry/hostname:tag
        # if official image, no registry
    # tag -- basically an alias to an image ID
    # multiple tags can point to the same image id
        # push an image with a new tag to do this
docker login # login (using same credentials as Docker's website )
cat ~/.docker/config.json # show auth config (after initial login)
docker image tag <image> <dockerhub_user>/<image> # re-tag an image as my own
docker image push <dockerhub_user>/<image> # push image to my dockerhub repo
docker image push <dockerhub_user>/<image> <dockerhub_user>/<image>:<tag> # redundant tag

## Building Images: Running Docker Builds
    # builder caches images.
    # after initial build, it only rebuilds if a layer has changed.
        # rebuilds changed line and all following lines.
        # put the things that change most at bottom of Dockerfile
docker image build -t <tag> . # build (and tag) image using Dockerfile (./Dockerfile)
docker image build -f Dockefile.dev . # build image, specify Dockerfile name (./Dockerfile.dev)
docker image ls # show images

<<DOCKERFILE
# choose base image
FROM <image>
# working directory (alternative to cd /some/path/)
WORKDIR '/app'
# copy files (that will be used in container)
COPY ./package.json . # src --> dest
# run command
RUN npm install
# copy rest of files
COPY . .
# expose ports
EXPOSE 5000
# default command
CMD ['npm', 'start']
DOCKERFILE

<<DOCKERFILE
FROM nginx
EXPOSE 443
COPY ./nginx.conf /etc/nginx/nginx.conf
# link nginx logs to stdout (will show up in docker logs)
    # forward request / error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
# CMD is implied (nginx has one already)
DOCKERFILE

# Container Lifetime & Persistent Data: Volumes, Volumes, Volumes

## Persistent Data: Data Volumes
docker volume ls # show volumes
docker volume inspect <volume> # show details (json) about volume
# mysql
docker volume create mysql-db # create volume
docker container run -d \
    --name mysql \
    -e MYSQL_ALLOW_EMPTY_PASSWORD=True \
    -v mysql-db:/var/lib/mysql \
    mysql # name, env, volume (host:container), image
# postgres
docker volume create pgData # create volume
docker container run -d \
    --name pg \
    -e POSTGRES_USER='postgres' \
    -e POSTGRES_PASSWORD='postgres' \
    -e POSTGRES_DB='db1' \
    -v pgData:/var/lib/postgresql/data \
     postgres:latest # run container with volume

## Persistent Data: Bind Mounting
    # mount host dir -> container dir
    # example -- $(pwd):/app
docker container run -d \
    --name <container_name> \
    -p 80:80 
    -v /path/on/host:/path/in/container \
    <image> # name, port mapping, bind mount (ie: $(pwd):/app), image

# Making It Easier with Docker Compose: The Multi-Container Tool

## Docker Compose and The Docker-compose.yml File
# https://docs.docker.com

## Trying Out Basic Compose Commands
pcat docker-compose.yml
docker-compose up # start compose
docker-compose up --build # start compose (build images before starting containers)
docker-compose up -d # start compose (detached)
docker-compose up -f docker-compose.dev.yml # start compose (custom compose filename)
docker-compose logs # 
docker-compose ps # list services (containers)
docker-compose top # list services (processes)
docker-compose stop # stop compose ('down' to stop and remove containers/volumes/networks)