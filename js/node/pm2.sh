# ----------
# pm2
# ----------

# pm2 -- daemon process manager

# cheatsheet -- https://pm2.keymetrics.io/docs/usage/quick-start/#cheatsheet

# install 
npm install -g pm2

# ----------
# start
# ----------

# start
    # supports bash, node, python, ruby, coffee, php, perl
pm2 start app.js # node
pm2 start my-script.sh # bash
pm2 start app.py # python

# arguments
--name <app_name> # specify app name
--watch # watch files & restart on changes
--max-memory-restart <200MB> # set memory threshold for app reload
--log <log_path> # specify log file
-- arg1 arg2 arg3 # pass arguments to script
--restart-delay <delay_in_ms> # delay between restarts
--time # prefix logs with time
--no-autorestart # do not auto-restart app
--cron <cron_pattern> # specify CRON for forced restart
--no-daemon # attach to application log

# logging args
-l --log [path]              # specify filepath to output both out and error logs
-o --output <path>           # specify out log file
-e --error <path>            # specify error log file
--time                       # prefix logs with standard formated timestamp
--log-date-format <format>   # prefix logs with custom formated timestamp
--merge-logs                 # when running mutiple process with same app name, do not split file by id

# ----------
# manage process
# ----------

# 'app_name', 'id', or 'all' can be used to specify process(es)

pm2 start <app_name>
pm2 restart <app_name> # kill and restart
pm2 reload <app_name> # 0-second-downtime reload
pm2 stop <app_name>
pm2 delete <app_name>

# stop all
pm2 kill

# ----------
# view
# ----------

# status
pm2 status # see status of processes # pm2 [list|ls|l|status]

# logs
pm2 logs # see logs

# logs options
pm2 logs --json # logs in json format // { message, timestamp, type, process_id, app_name }
pm2 logs --format # timestamp=2019-06-21-19:03:58-0700 app=stdout id=9 type=out message=ooo

# flush logs
pm2 flush

# ----------
# cluster mode
# ----------

# https://pm2.keymetrics.io/docs/usage/cluster-mode/

pm2 start app.js -i max # start in cluster mode (max -- detect available CPUs and run as many processes as possible)

# ----------
# ecosystem
# ----------

pm2 ecosystem # generate ecosystem file (ecosystem.config.js)
pm2 start ecosystem.config.js # pm2 [start|restart|reload|stop|delete] ecosystem.config.js

<<JS
// ecosystem.config.js (default)
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }, {
     name: 'worker',
     script: 'worker.js'
  }]
}
JS

# ----------
# setup startup script
# ----------

# https://pm2.keymetrics.io/docs/usage/startup/

# restart pm2 processes on server boot/reboot
pm2 startup # generate auto-configured startup script. output -- it will give you a command to run
pm2 save # save list of applications to manage (after starting all desired applications)

# after upgrading node version
    # the following will update startup script
pm2 unstartup
pm2 startup

# init systems supported
    # systemd (Ubuntu >= 16, CentOS >=7, Debian >= 7)
    # launchd: Darwin, MacOSx
    # etc

# ----------
# restart on file changes
# ----------

pm2 start env.js --watch --ignore-watch="node_modules"

# ----------
# deploy
# ----------

# https://pm2.keymetrics.io/docs/usage/deployment/

# ----------
# docker integration
# ----------

# https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------



# ----------
# 
# ----------