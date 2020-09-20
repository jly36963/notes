# -------------
# nginx
# -------------

# nginx.org has most of the docs
# nginx.com is a product website

# install (through apt package manager, no customization)
sudo apt-get update
sudo apt-get install nginx

# -------------
# curl
# -------------

curl url # make get request (standard out)
curl -I url # get headers
curl -I --http2 -s url | grep HTTP # check if website supports http/2
curl -L url # make get request, follow redirects
curl -O url # download (assumes fn)
curl -o fn url # download (specify fn)

# -------------
# custom build (build nginx from source)
# -------------

# download in home directory

# if installing source code from nginx.org (C compiler not found)
sudo apt-get install build-essential # install gcc
# if installing source code from nginx.org (PCRE needed)
sudo apt-get install libpcre3 libpcre3-dev zlib1g zlib1g-dev libssl-dev

# download source files from nginx.org
    # https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#sources
wget https://nginx.org/download/nginx-1.16.1.tar.gz
tar zxf nginx-1.16.1.tar.gz
cd nginx-1.16.1

# see list of modules
./configure --help

# configure build options (inside nginx folder)
./configure \
--sbin-path=/usr/bin/nginx \
--conf-path=/etc/nginx/nginx.conf \
--error-log-path=/var/log/nginx/error.log \
--http-log-path=/var/log/nginx/access.log \
--with-pcre \
--pid-path=/var/run/nginx.pid \
--with-http_ssl_module
--with-http_v2_module

# install compiled source
make install

# check for executable
ls -l /etc/nginx/

# check version
nginx -V

# -------------
# nginx service (systemd)
# -------------

# see nginx processes
ps aux | grep nginx 
# help
nginx -h
# signal
nginx -s stop # stop, quit, reopen, reload
# test
nginx -t

# systemd service
    # https://www.nginx.com/resources/wiki/start/topics/examples/initscripts/
    # look for `Systemd` link (service file)
    # save file as `/lib/systemd/system/nginx.service`


# -------------
# nginx service
# -------------

# check status
sudo systemctl status nginx

# service
sudo systemctl start nginx # start service
sudo systemctl stop nginx # stop service
sudo systemctl enable nginx # start service at startup
sudo systemctl disable nginx # don't start service at startup

# reload
sudo systemctl reload nginx
# restart
sudo systemctl restart nginx

# allow HTTP through firewall
sudo ufw allow 'Nginx HTTP'

# -------------
# configuration terms
# -------------

# /etc/nginx/nginx.conf is the general config file.
# /etc/nginx/conf.d/default.conf is used to configure the default virtual host
# many people include `default.conf` in the `nginx.conf` file.

# main configuration terms
    # context -- sections within configuration (scope for directives)
    # directive -- config options (key, value)

# /etc/nginx/nginx.conf
    # default ports: 80 (http) 443 (https)
    # ip address: `ip a` `ip addr show` `hostname-I` 
    # server_name -- domain
    # nginx prioritizes match modifiers (ie -- regex before prefix)
    # location priority -- exact, preferential prefix, regex, prefix
    # variables: $var 'value'; (built in: $http $uri $args)
    # return redirect (changes uri) , rewrite (mutates internally)
    # try_files: try file locations. if !(exists), move to next. if last argument, rewrite.
'
# worker processes -- should equal number of cores (auto does this)
worker_processses: auto;

events {
  worker_connections 1024;
}

http {

  include mime.types

  server {

    listen 80;
    server_name 127.0.0.1;
    root /sites/demo;

    # exact match
    location = /greet {
      return 200 "Hello from NGINX /greet exact!";
    }
    # preferential prefix match (high priority prefix match)
    location ^~ /greet {
      return 200 "Hello from NGINX /greet preferential prefix match!";
    }
    # regex match
    location ~ /greet[0-9]? {
      return 200 "Hello from NGINX /greet regex!";
    }
    # regex (ignore case)
    location ~* /greet[0-9]? {
      return 200 "Hello from NGINX /greet regex (case insensitive)!";
    }
    # prefix match
    location /greet {
      return 200 "Hello from NGINX /greet prefix!";
    }  

    # variables
    location inspect {
      return 200 "$host\n$uri\n$args";
    }   

    # redirect
    location /logo {
      return 307 /thumb.png;
    }

    # rewrite (capture variables)
    rewrite ^/user/(\w+) /account/$1/
    location /account {
        return 200 "Hello from NGINX rewrite!";
    }
  }
}
'


# -------------
# logging
# -------------

# nginx provides two types of logs
    # error logs -- logs where nginx has malfunctioned (ie -- improper config, not 404 responses)
    # access logs

# logs are enabled by default, turning some off may de-clutter and improve performance

# control access logging (nginx.conf)
    # additional logs
    # turn access logging off
    # modify error_log and access_log using paramters
        # https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
'
(... skipped parts)

http {
  include mime.types;
  server {
    listen 80;
    server_name 127.0.0.1;
    root /sites/demo;
    
    # separate access log
    location /hello {
        access_log /var/log/nginx/hello.access.log;
        return 200 "Hello!"
    }

    # access log disabled
    location /hello2 {
        access_log off;
        return 200 "Hello again!";
    }
  }
}
'

# -------------
# inheritance and directive types
# -------------

# array directive (ie access_log)
    # can be specified multiple times without overriding a previous setting
    # gets inherited by all child contexts
    # child context can override inheritance by re-declaring directive

# standard directive (ie root)
    # can only be declared once. subsequent declarations override the first.
    # gets inherited by all child directives.
    # child context can override inheritance by ree-declaring directive

# action directive (ie return)
    # invokes an action such as a return/rewrite
    # inheritance not applicable




# -------------
# worker processes
# -------------

# number of worker processes should equal number of cores on the server
    # 'worker_processes auto;'  will do this
# number of worker connections should equal the cpu limit (ulimit -n)

# number of cores
nproc
# cpu info (cores listed as 'CPU(s)')
lscpu
# limit on number of open files
ulimit -n

# -------------
# buffers and timeouts
# -------------

# buffering -- writing to memory before sending to next destination (send to client, write to disk)

# units
    # timeout -- 1, 1s, 1m, 1h, 1d
    # buffer -- 1, 1k, 1m

# /etc/nginx/nginx.conf
'
worker_processes auto;

events {
  worker_connections 1024;
}

http {
  include mime.types;
  
  # buffer size for POST submissions
  client_body_buffer_size 10k ;
  client_max_body_size 8m;

  # buffer size for headers
  client_header_buffer_size 1k;

  # Max time to receive client headers/body
  client_body_timeout 12;
  client_header_timeout 12;

  # Max time to keep a connection open for
  keepalive_timeout 15;

  # Max time for the client to accept/receive a response
  send_timeout 10;

  # Skip buffering for static files
  sendfile on;

  # optimize sendfile packets
  tcp_nopush on;

  server {

  }

}
'

# -------------
# dynamic modules
# -------------

# include module in ./configure and build step
# import into nginx.conf
    # `load_module relative/path_to/module_name;`


# -------------
# fastCGI caching
# -------------

# /etc/nginx/nginx.conf

'
(... skipping parts)

http {
  include mime.types;

  # configure microcache (fastCGI) (/tmp chosen because it is cleared at boot)
  fastcgi_cache_path /tmp/nginx_cache levels=1:2 keys_zone=ZONE_1:100m inactive=60m;
  fastcgi_cache_key "$scheme$request_method$host$request_uri";
  add_header X-Cache $upstream_cache_status;

  server {
    listen 80;

    location / {
      proxy_pass http://client;

      # enable cache (using keys_zone)
      fastcgi_cache ZONE_1;
      fastcgi_cache_valid 200 60m;
      fastcgi_cache_valid 404 10m;
    }
  }
}
'

# -------------
# http2 and ssl (modules required) 
# -------------

# ssl certificate/key required
# to create test ssl certificate and private key (don't use in production -- not trusted)
# create dir /etc/nginx/ssl
openssl req -x509 -days 10 -nodes -newkey rsa:2048 -keyout /etc/nginx/ssl/self.key -out /etc/nginx/ssl/self.crt

# /etc/nginx/nginx.conf

'
(... skipping parts)

http {
  include mime.types;

  server {
    listen 443 ssl http2;

    ssl_certificate /etc/nginx/ssl/self.crt;
    ssl_certificate_key /etc/nginx/ssl/self.key;

    location / {
      proxy_pass http://client;
    }
  }
}
'

# -------------
# reverse-proxy
# -------------

# listen on port 8888, forward to port 3000 (ie create-react-app server)
    # proxy_pass: trailing slash affects interpretation
        # curl http://localhost:5000/api;
        # `proxy_pass: http://localhost:5000` -- '/api'
        # `proxy_pass: http://localhost:5000/` --  '/'
    # add 'add_header proxied nginx;' line to add header for proxied requestss

# start nginx with config file
nginx -c /path/to/nginx.conf

# /etc/nginx/nginx.conf
'
events {}

http {
  server {
    listen 8888;
    location /api {
      proxy_pass: http://localhost:5000;
    }
    location / {
      proxy_pass: http://localhost:3000;
    }
  }
}
'

# -------------
# load balancing 
# -------------

# start multiple servers on different ports

# /etc/nginx/nginx.conf
'
events {}

http {
  upstream api {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
  }
  upstream client {
    server localhost:3000;
    server localhost:3001;
  }

  server {
    listen 8888;

    location /api {
      proxy_pass http://api;
    }
    location / {
      proxy_pass http://client;
    }
  }
}
'

# -------------
# sticky sessions
# -------------





# -------------
# ddos (requests and connections)
# -------------

# /etc/nginx/nginx.conf
'
events{}

http {
  # limiting rate of requests
  limit_req_zone $binary_remote_addr zone=one:10m rate=60r/m;
  # limiting number of connections
  limit_conn_zone $binary_remote_addr zone=addr:10m;

  server {
    location / {
      limit_req zone=one;
      limit_conn addr 10;
    }
  }
}
'



# -------------
# 
# -------------


# -------------
# nginx (docker example)
# -------------

# nginx image
    # view docs on dockerhub for configuration setup.
docker pull nginx

# Dockerfile
FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf


# default.conf
'
upstream client {
  server client:3000;
}

upstream api {
  server api:5000;
}

server {
  listen 80;

  location / {
    proxy_pass http://client;
  }

  location /api {
    proxy_pass http://api;
  }
}
'

# -------------
# load balancing (docker)
# -------------

# start multiple servers on different ports

# /etc/nginx/nginx.conf
'
events {}

http {
  upstream api {
    server api:5000;
    server api:5001;
    server api:5002;
  }
  upstream client {
    server client: 3000;
    server client: 3001;
  }

  server {
    listen 8888;

    location /api {
      proxy_pass: http://api;
    }
    location / {
      proxy_pass: http://client;
    }
  }
}
'


# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





# -------------
# 
# -------------





