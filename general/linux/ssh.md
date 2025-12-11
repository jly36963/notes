# ssh

## ssh server

- ssh server is not installed by default (ubuntu)
- ssh client is installed by default (ubuntu)

```bash
sudo apt-get update
sudo apt-get install openssh-server
sudo systemctl status ssh # check status of ssh
```

## LAN connection

```bash
# figure out IP address
ip a
# LAN connection
ssh username@ip_address
# will be prompted for password
```

## internet connection

- know your public IP address
- configure your router to accept data on port 22 (and forward it)
  - public ip address -- https://ifconfig.co/ip

```bash
# internet connection
ssh username@public_ip_address
```

## ssh service

```bash
# start/stop
sudo systemctl start ssh
sudo systemctl stop ssh

# enable/disable (whether or not it will start during system boot)
sudo systemctl enable ssh
sudo systemctl disable ssh

# alternative
sudo service ssh start
sudo service ssh restart
```

## host-based config options

```bash
# get list of host config options
man ssh_config
```

# options file at `~/.ssh/config`

```
Host hostname
    option value
    option value
```

# example

```
Host locutus.borg.domainecom
    User really_long_username
    Port 2222
    Protocol 2
    Cipher blowfish-cbc,aes256-cbc
```

```bash
# connect to example
ssh locotus.borg.domain.com
```

## keypairs

```bash
# ed25519 key (not all servers support this method)
ssh-keygen -t ed25519 -o -a 100
# rsa key (better)
# will be prompted to specify output directory and enter/confirm passphrase
# if no passphrase provided, key won't require password to be used.
# two files generated in `~/.ssh/`, id_rsa (private key) and id_rsa.pub (public key)
ssh-keygen -t rsa -b 4096 -o -a 100
ssh-keygen -t rsa
ssh-keygen -t rsa -b 4096 -C "email@domain.com" # comment
ssh-keygen -t rsa -b 4096 -f my_key # specify filename

# make .ssh dir on server (log into server first)
mkdir -p ~/.ssh
# copy public key to server (replace `hostname`) (exit connection if logged in to server)
cat ~/.ssh/id_rsa.pub | ssh hostname "cat >> ~/.ssh/authorized_keys"
# alternative copy method
ssh-copy-id remote_host

# if keys set up and copied correctly, log in (replace `hostname`)
# if password set for key, you will be prompted to enter that password.
ssh remote_username@remote_host
ssh -p port_number remote_username@remote_host # custom port
ssh remote_username@remote_host ls # issue single command
ssh ip_address -l user_name -i identity_file

# troubleshoot (verbose)
ssh -v hostname
```
