# ------------
# ------------
# ansible (configuration management and orchestration)
# ------------
# ------------

sudo apt-get install ansible
ansible --version
ansible-playbook --version
ansible-galaxy --help

# ------------
# ansible workflow
# ------------

# host setup
# inventory (list of groups of hosts)
# playbook (start host or do something with host)
# roles (tasks and handlers for playbooks)

# ------------
# ssh
# ------------

# key pair -- public and private keys

ssh # returns list of ssh commands & parameter options
ssh server.example.org # simple connection to IP address
ssh remote_host_userID@server.example.org # connection with user id

sshd # initiates ssh server, waits for incoming ssh connection requests.
ssh-keygen # program for creating new authentication key pairs for sh.
ssh-copy-id # program used to copy, install, and configure an ssh key on a server.
ssh-agent # helper program that tracks identity keys and passphrases. (remembers passwords)
ssh-add # used with 'ssh-agent'. add a key to ssh auth agent, implement single sign-on using ssh.
scp # program for copying files from one computer to another.
stfp # file transfer protocol

# ------------
# inventory (static) (local)
# ------------

# inventory file (dev)
    # [groupname]
    # 'ansible_connection=local' prevents control from trying to ssh into itself.
'
[loadbalancer]
lb1

[webserver]
app01
app02

[database]
db01

[control]
control ansible_connection=local
'

# ------------
# list hosts
# ------------

# by default, ansible looks for inventory in '/etc/ansible/hosts'. '-i dev' overrides.
ansible -i dev --list-hosts all

# ansible.cfg
'
[defaults]
inventory = ./dev
vault_password_file = ~/.vault_pass.txt
'

# list hosts (with inventory set to './dev', we no longer need '-i dev')
ansible --list-hosts all
ansible --list-hosts "*"
ansible --list-hosts webserver # webserver group items
ansible --list-hosts app0* # wildcard (app01 app02)
ansible --list-hosts database,control # multiple groups
ansible --list-hosts webserver[0] # first item of webserver group

# get info
ansible -m setup host_name

# ------------
# tasks
# ------------

# every task has module/parameters

ansible -m ping all # ping all hosts
ansible -m command -a "hostname" all
ansible -a "hostname" all # command is default module


# ------------
# ------------
# playbooks
# ------------
# ------------

# ./playbooks/hostname.yml
'
---
- hosts: all
  tasks:
    - name: get server hostname
      command: hostname
'
# ./playbooks/loadbalancer.yml
    # "become: true" gives sudo access
    # state (apt): present (install and keep using same version), latest (always use latest version)
    # update_cache (sudo apt-get update, keep repositories current)
    # state (service): started (start if not started), restart (restart every time)
'
---
- hosts: loadbalancer
  become: true
  roles:
    - nginx
'
# ./playbooks/database.yml (tasks in /roles/mysql/tasks/main.yml)
    # might need to wrap variable injections -- "{{ db_name }}"
    # also might need to get rid of dictionary syntax and have new line for each variable
'
---
- hosts: database
  become: true
  roles:
    - { role: mysql, db_name: {{ db_name }}, db_user_name: {{ db_user }}, db_user_pass: {{ db_pass }}, db_user_host: "%" }
'
# ./playbooks/webserver.yml
    # {{item}} -- jinja syntax for injecting 'with_items'
'
---
- hosts: webserver
  become: true
  roles:
    - apache2
    - demo_app
    - { role: demo_app, db_name: {{ db_name }}, db_user: {{ db_user }}, db_pass: {{ db_pass }}}
'
# ./playbooks/control.yml (tasks in /roles/control/tasks/main.yml)
'
---
- hosts: control
  become: true
  roles:
    - control
'

# ./roles/nginx/templates/nginx.conf.j2
    # item.key variable will come from with_dict in /roles/nginx/tasks/main.yml
'
upstream {{ item.key }} {
{% for server in groups.webserver %}
  server {{ server }}:{{ item.value.backend }};
{% endfor %}
}

server {
    listen {{ item.value.frontend }};

    location / {
        proxy_pass http://{{ item.key }};
    }
}
'

# execute playbook
ansible-playbook playbooks/hostname.yml
ansible-playbook playbooks/database.yml
ansible-playbook playbooks/webserver.yml
ansible-playbook playbooks/control.yml

# ./playbooks/stack_restart.yml
'
---
# bring stack down

- hosts: loadbalancer
  become: true
  tasks:
    - service: name=nginx state=stopped
    - wait_for: port=80 state=drained

- hosts: webserver
  become: true
  tasks:
    - service: name=apache2 state=stopped
    - wait_for: port=80 state=stopped

# restart & bring stack up

- hosts: database
  become: true
  tasks:
    - service: name=mysql state=restarted
    - wait_for: host={{ ansible_eth0.ipv4.address }} port=3306 state=started

- hosts: webserver
  become: true
  tasks:
    - service: name=apache2 state=started
    - wait_for: port=80 state=started

- hosts: loadbalancer
  become: true
  tasks:
    - service: name=nginx state=started
    - wait_for: port=80 state=started

'

# restart stack
ansible-playbook playbooks/stack_restart.yml

# ./playbooks/stack_status.yml
'
---
- hosts: loadbalancer
  become: true
  tasks:
    - name: verify nginx service
      command: service nginx status

    - name: verify nginx is listening on 80
      wait_for: port=80 timeout=1
      
- hosts: webserver
  become: true
  tasks:
    - name: verify apache2 service
      command: service apache2 status
    
    - name: verify apache2 is listening on 80
      wait_for: port=80 timeout=1
      
- hosts: database
  become: true
  tasks:
    - name: verify mysql service
      command: service mysql status

    - name: verify mysql is listening on 3306
      wait_for: host={{ ansible_eth0.ipv4.address }} port=3306 timeout=1
      
- hosts: control
  tasks: 
    - name: verify end-to-end response
      uri: url=http://{{item}} return_content=yes
      with_items: groups.loadbalancer
      register: lb_index

    - fail: msg="index failed to return content"
      when: "\"Hello, from sunny\" not in item.content"
      with_items: "{{lb_index.results}}"

- hosts: loadbalancer
  tasks:
    - name: verify backend response
      uri: url=http://{{item}} return_content=yes
      with_items: group.webserver
      register: app_index
    
    - fail: msg="index failed to return content"
      when "\"Hello, from sunny {{item.item}}!\" not in item.content"
      with_items: "{{app_index.results}}"
'

# check status
ansible-playbook playbooks/stack_status.yml


# ------------
# ------------
# roles
# ------------
# ------------

# in root directory of project, create 'roles' folder, cd into it, init roles.
mkdir roles
cd roles
ansible-galaxy init control
ansible-galaxy init nginx
ansible-galaxy init apache2
ansible-galaxy init demo_app
ansible-galaxy init mysql

# /roles/control/tasks/main.yml
'
---
- name: install tools
  apt: name={{item}} state=present update_cache=yes
  with_items:
    -curl
    - python-httplib2
'

# /roles/mysql/tasks/main.yml
ansible -m setup db01 # get info about db01 (fact used for db port)
'
---
- name: install tools
  apt: name={{item}} state=present update_cache=yes
  with_items:
    - python-mysqldb

- name: install mysql-server
  apt: name=mysql-server state=present update_cache=yes

- name: ensure mysql listening on all ports
  lineinfile: dest=/etc/mysql/my.cnf regexp=^bind-address line="bind-address = {{ ansible_eth0.ipv4.address }}"
  notify: restart mysql

- name: ensure mysql started
  service: name=mysql state=started enabled=yes

- name: create database
  mysql_db: name={{ db_name }} state=present

- name: create demo user
  mysql_user: name={{ db_user_name }} password={{ db_user_pass }} priv={{ db_name }}.*:ALL host="{{ db_user_host }}" state=present
'

# /roles/mysql/handlers/main.yml
'
---
- name: restart mysql
  service: name=mysql state=restarted
'

# /roles/mysql/defaults/main.yml
'
---
db_name: myapp
db_user_name: dbuser
db_user_pass: dbpass
db_user_host: localhost
'

# /roles/nginx/tasks/main.yml
    # included in ./loadbalancer.yml
'
---
- name: install tools
  apt: name={{item}} state=present update_cache=yes
  with_items:
    - python-httplib2

- name: install nginx
  apt: name=nginx state=present update_cache=yes

- name: configure nginx sites
  template: src=nginx.conf.j2 dest=/etc/nginx/sites-available/{{ item.key }} mode=0644
  with_dict: sites
  notify: restart nginx

- name: get active sites
  shell: ls -1 /etc/nginx/sites=enabled
  register: active

- name: deactivate nginx sites
  file: path=/etc/nginx/sites-enabled/{{ default }} state=absent
  with_items: active.stdout_lines
  when: item not in sites
  notify: restart nginx

- name: activate nginx sites
  file: src=/etc/nginx/sites-available/{{ item.key }} dest=/etc/nginx/sites-enabled/demo state=link
  with_dict: sites
  notify: restart nginx

- name: ensure nginx started
  service: name=nginx state=started enabled=yes
'

# /roles/nginx/handlers/main.yml
'
---
- name: restart nginx
  service: name=nginx state=restarted
'

# /roles/nginx/defaults/main.yml
'
---
sites:
  myapp:
    frontend: 80
    backend: 80
'

# /roles/apache2/tasks/main.yml
'
---
- name: install web components
  apt: name={{item}} state=present update_cache=yes
  with_items:
    - apache2
    - libapache2-mod-wsgi
    
- name: ensure modwsgi enabled
  apache2_module: state=present name=wsgi
  notify: restart apache2
    
- deactivate default apache site
  file: path=/etc/apache2/sites-enabled/000-default.conf state=absent
  notify: restart apache2

- name: ensure apache2 started
  service: name=apache2 state=started enabled=yes
'

# /roles/apache2/handlers/main.yml
'
---
- name: restart apache2
  service: name=apache2 state=restarted
'

# /roles/demo_app/tasks/main.yml
'
---
- name: install web components
  apt: name={{item}} state=present update_cache=yes
  with_items:
    - python-pip
    - python-virtualenv
    - python-mysqldb
        
- name: copy demo app source
  copy: src=demo/app/ dest=/var/www/demo mode=0755
  notify: restart apache2
        
- name: copy demo.wsgi
  template: src=demo.wsgi.j2 dest=/var/www/demo/demo.wsgi mode=0755
  notify: restart apache2
    
- name: copy apache virtual host config
  copy: src=demo/demo.conf dest=/etc/apache2/sites-available mode=0755
  notify: restart apache2

- name: set up python virtualenv
  pip: requirements=/var/www/demo/requirements.txt virtualenv=/var/www/demo/.venv
  notify: restart apache2

- name: activate demo apache site
  file: src=/etc/apache2/sites-availabile/demo.conf dest=/etc/apache2/sites-enabled/demo.conf state=link
  notify: restart apache2
'

# /roles/demo_app/handlers/main.yml
'
---
- name: restart apache2
  service: name=apache2 state=restarted
'


# ------------
# ------------
# site.yml
# ------------
# ------------

# start all services
ansible-playbook site.yml

# ./site.yml (entry point for all playbooks)
'
---
- include: control.yml
- include: database.yml
- include: loadbalancer.yml
- include: webserver.yml
'

# ------------
# group_vars (centralize variables)
# ------------

# create ./group_vars/all directory

# ./group_vars/all/vars.yml
    # vault_db_pass is a reference to a protected variable in the vault
'
---
db_name: demo
db_user: demo
db_pass: "{{ vault_db_pass }}"
'

# ------------
# ansible vault
# ------------

# protect sensitive information
    # encrypts files, promps for password when ansible is run.
    # group_vars can be paired with a vault file and reference values in the vault.

# create vault
    # while inside ./group_vars/all/vars.yml
    # will be prompted for password
    # enter contents into terminal.
    # will create file `./group_vars/all/vault`
    # store password in file: `echo "mypassword" > ~/.vault_pass.txt`
    # set permissions: `chmod 0600 $!`
    # add `vault_password_file = ~/.vault_pass.txt` to ansible.cfg file
ansible-vault create vault # initialize vault file
ansible-vault edit vault # edit vault file

#
'
---
vault_db_pass: PaSsWoRd1253
'

# ------------
# env (example -- separate from project)
# ------------

# read env variables (controller)
    # for target machine: `{{ ansible_env.VARIABLE }}`

'
---
- hosts: database
  become: true
  roles:
    - mysql
      db_name: {{ lookup("env", "DB_NAME") }}
      db_user_name: {{ lookup("env", "DB_USER") }}
      db_user_pass: {{ lookup("env", "DB_PASS") }}
      db_user_host: "%" 
'

# set env variables
'
- hosts: db
  tasks: 
    - name: echo env variable
      shell: "echo $VAR1"
      environment:
        VAR1: value1
'


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


