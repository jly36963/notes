# -------------
# terraform
# -------------

# terraform -- infrastructure as code

# download
    # https://www.terraform.io/downloads.html
    # donwload file
    # move to executable directory `sudo mv terraform /usr/local/bin/`
# aws resources
    # https://www.terraform.io/docs/providers/aws/
# providers
    # https://www.terraform.io/docs/providers/index.html


# useful commands
terraform plan # plan
terraform apply # avoid using this in production
terraform show # show current state
cat terraform.tfstate # show state in JSON format


# -------------
# preparation
# -------------

# create AWS account
# create IAM admin user for terraform to use (identity access management)
    # create user
    # click on user, go to permissions, attach policy (administrator access)
# create terraform file to spin up instance
# run terraform apply (send instructions to AWS for execution)

# -------------
# terraform commands
# -------------

# see commands
terraform

# commands
terraform apply # build/change infrastructure
terraform destroy # destroy infrastructure
terraform get # download/install modules for configuration
terraform graph # get visual graph of terraform resources
terraform import # import existing infrastructure into terraform
terraform init # initialize terraform config from a module
terraform plan # generate and show an execution plan
terraform push # upload this terraform module to Atlas to run
terraform refresh # update local state file against real resources
terraform remote # configure remote state storage
terraform show # show state/plan. use `-json` to display in json format.
terraform state # advanced state management
terraform taint # mark resource for destruction/recreation (provide resource as arg)
terraform untaint # unmark a tainted resource (provide resource as arg)
terraform validate # validate terraform files
terraform version # print terraform version

# -------------
# instance.tf (example)
# -------------

# options
    # https://www.terraform.io/docs/providers/aws/r/instance.html#ami
# ubuntu ami ec2 locator
    # https://cloud-images.ubuntu.com/locator/ec2/

# initialize config
terraform init
# preview build
terraform plan
# build infrastructure
terraform apply
# remove instance
terraform destroy

# BETTER VERSION (manual revision)
terraform init
terraform plan -out=tfplan -input=false
terraform apply -input=false tfplan
terraform destroy

# -------------
# example1
# -------------

###
# prep steps
ssh-keygen -f my_key # generate ssh key (he did not set passphrase)
# go to aws > networking (services) > vpc > edit security group > add your IP address
###

# provider.tf
provider "aws" {
  access_key = "${var.AWS_ACCESS_KEY}"
  secret_key = "${var.AWS_SECRET_KEY}"
  region = "${var.AWS_REGION}"
}

# instance.tf
    # file uploads can be used in conjunction with 'remote-exec' to execute scripts
    # override/configure ssh connection, use 'connection' (with ssh keypairs)
resource "aws_key_pair" "my_key" {
    key_name = "my_key"
    public_key = "${file("${var.PATH_TO_PUBLIC_KEY}")}"
}

resource "aws_instance" "example" {
  ami = "${lookup(var.AMIS, var.AWS_REGION)}" # amazon machine image (ubuntu 18 amd ebs-ssd)
  instance_type = "t2.micro" # instance type
  key_name = "${aws_key_pair.my_key.key_name}" # ssh connection key pair

  provisioner "file" {
    source = "script.sh"
    destination = "/tmp/script.sh"
  }
  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/script.sh"
      "sudo /tmp/script.sh"
    ]
  }
  provisioner "local-exec" {
    command = "echo ${aws_instance.example.private_ip} >> private_ips.txt" # output private IP
  }
  connection {
    user = "${var.INSTANCE_USERNAME}"
    private_key = "${file(${var.PATH_TO_PRIVATE_KEY})}"
  }
}

output "ip" {
  value = "${aws_instance.example.public_ip}" # public IP address of AWS resource
}

# vars.tf
variable "AWS_ACCESS_KEY" {}
variable "AWS_SECRET_KEY" {}
variable "AWS_REGION" {
  default = "us-east-1"
}
variable "AMIS" {
  type = "map"
  default = {
    us-east-1 = "ami-064a0193585662d74"
    us-east-2 = "ami-021b7b04f1ac696c2"
    us-west-1 = "ami-056d04da775d124d7"
    us-west-2 = "ami-09a3d8a7177216dcf"
  }
}

variable "PATH_TO_PRIVATE_KEY" {
    default = "my_key"
}
variable "PATH_TO_PUBLIC_KEY" {
    default = "my_key.pub"
}
variable "INSTANCE_USERNAME" {
    default = "ubuntu"
}

# terraform.tfvars (secret! put in .gitignore)
AWS_ACCESS_KEY = "<access_key>"
AWS_SECRET_KEY = "<secret_key>" # enter actual access/secret keys
AWS_REGION = "us-east-1"

# -------------
# example1 (concepts)
# -------------

# variables
    # variables are injected into instance.tf from vars.tf
        # user = "${var.INSTANCE_USERNAME}"
    # variables are declared in vars.tf
    # defaults can be set
    # maps can be used. example reference below:
        # ami = "${lookup(var.AMIS, var.AWS_REGION)}"
    # sensitive information can be set in terraform.tfvars

# software provisioning
    # ansible -- run terraform, output IP addresses, then run ansible playbook on those hosts

# state
    # terraform keeps the remote state of the infrastructure (terraform.tfstate)
    # terraform also keeps a backup of the previous state (terraform.tfstate.backup)

# remote state
    # allows for a centralized state. won't have conflicts between collaborators

# datasources
    # get dynamic information from aws api service
    # examples: list of AMIs, availability zones, etc.

# templates
    # template provider can create customized configuration files
    # templates can use variables from terraform resource attributes.
    # provider template can be used to pass user-data.

# modules
    # better organize terraform using modules

# -------------
# example 2 (AWS in-depth)
# -------------

# to see public/private IP address:
    # nano terraform.tfstate
    # look for 'private_ip' and 'public_ip'
    # also has 'private_dns' and 'public_dns'
# ssh
    # ssh ip_address -l

# keypairs.tf 

resource "aws_key_pair" "mykeypair" {
    key_name = "mykeypair"
    public_key = "${file("keys/mykeypair.pub")}"
}

# provider.tf

provider "aws" {
  access_key = "${var.AWS_ACCESS_KEY}"
  secret_key = "${var.AWS_SECRET_KEY}"
  region = "${var.AWS_REGION}"
}

# instance.tf

resource "aws_instance" "example" {
  ami = "${lookup(var.AMIS, var.AWS_REGION)}" # amazon machine image (ubuntu 18 amd ebs-ssd)
  instance_type = "t2.micro" # instance type
  subnet_id = "${aws_subnet.main-public-1.id}" # vpc subnet
  vpc_security_group_ids = ["${aws_security_group.allow-ssh.id}"] # security group
  key_name = "${aws_key_pair.mykeypair.key_name}" # public SSH key
}

# vars.tf

variable "AWS_ACCESS_KEY" {}
variable "AWS_SECRET_KEY" {}
variable "AWS_REGION" {
  default = "us-east-1"
}
variable "AMIS" {
  type = "map"
  default = {
    us-east-1 = "ami-064a0193585662d74"
    us-east-2 = "ami-021b7b04f1ac696c2"
    us-west-1 = "ami-056d04da775d124d7"
    us-west-2 = "ami-09a3d8a7177216dcf"
  }
}

# terraform.tfvars (secret! put in .gitignore)

AWS_ACCESS_KEY = "<access_key>"
AWS_SECRET_KEY = "<secret_key>" # enter actual access/secret keys
AWS_REGION = "us-east-1"

# vpc.tf

# internet VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/8" # range of IP addresses
  instance_tenancy = "default" # every instance will have default tenancy
  enable_dns_support = "true"
  enable_dns_hostnames = "true" # internal hostname and domain name (???)
  enable_classiclink = "false" # link to ec2-classic (don't do this)
  tags {
    Name = "main" # give name to VPC
  }
}
# public subnets
resource "aws_subnet" "main-public-1" {
  vpc_id = "${aws_vpc.main.id}" # which vpc
  cidr_block = "10.0.0.0/8"
  map_public_ip_on_launch = "true" # public IP address?
  availability_zone = "us-east-1a" # which availability zone
  tags {
    Name = "main-public-1" # give name to subnet
  }
}
resource "aws_subnet" "main-public-2" {
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "10.0.0.0/8"
  map_public_ip_on_launch = "true"
  availability_zone = "us-east-1b"
  tags {
    Name = "main-public-2"
  }
}
resource "aws_subnet" "main-public-3" {
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "10.0.0.0/8"
  map_public_ip_on_launch = "true"
  availability_zone = "us-east-1c"
  tags {
    Name = "main-public-3"
  }
}
# private subnets
resource "aws_subnet" "main-private-1" {
  vpc_id = "${aws_vpc.main.id}" # which vpc
  cidr_block = "10.0.0.0/8"
  map_public_ip_on_launch = "false" # public IP address?
  availability_zone = "us-east-1a" # which availability zone?
  tags {
    Name = "main-private-1" # give name to subnet
  }
}
resource "aws_subnet" "main-private-2" {
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "10.0.0.0/8"
  map_public_ip_on_launch = "false"
  availability_zone = "us-east-1b"
  tags {
    Name = "main-private-2"
  }
}
resource "aws_subnet" "main-private-3" {
  vpc_id = "${aws_vpc.main.id}"
  cidr_block = "10.0.0.0/8"
  map_public_ip_on_launch = "false"
  availability_zone = "us-east-1c"
  tags {
    Name = "main-private-3"
  }
}
# IGW (internet gateway)
resource "aws_internet_gateway" "main-igw" {
  vpc_id = "${aws_vpc.main.id}"
  tags {
    Name = "main"
  }
}
# RTs (route tables)
resource "aws_route_table" "main-public" {
  vpc_id = "${aws_vpc.main.id}"
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "${aws_internet_gateway.main-igw.id}"
  }
  tags {
    Name = "main-public-1"
  }
}
# route associations
resource "aws_route_table_association" "main-public-1-a" {
  subnet_id = "${aws_subnet.main-public-1.id}"
  route_table_id = "${aws_route_table.main-public.id}"
}
resource "aws_route_table_association" "main-public-2-a" {
  subnet_id = "${aws_subnet.main-public-2.id}"
  route_table_id = "${aws_route_table.main-public.id}"
}
resource "aws_route_table_association" "main-public-3-a" {
  subnet_id = "${aws_subnet.main-public-3.id}"
  route_table_id = "${aws_route_table.main-public.id}"
}

# securitygroup.tf

resource "aws_security_group" "allow-ssh" {
  vpc_id = "${aws_vpc.main.id}"
  name = "allow-ssh"
  description = "security group that allows ssh and all egress traffic"
  egress {
    from_port = 0 # all ports
    to_port = 0
    protocol = "-1" # all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 22
    to_port = 22
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"] # best practice, don't leave open to all IP addresses
  }
  tags {
    Name = "allow-ssh"
  }
}

# nat.tf
    # NAT -- network address translation
    # used in a public subnet to enable instances in a private subnet to initiate outbound traffic
# skipped

# -------------
# example2 (concepts)
# -------------

# VPC -- virtual private cloud (network)
    # create a VPC (manage it with terraform)
    # one VPC per region is suitable for small/medium setups. (more VPCs for larger)
    # EC2 intances from separate VPCs can't communicate using private IP addresses.
    # peering -- linking separate VPCs
    # example CIDRs: 10.0.0.0/8  172.16.0.0/12  192.168.0.0/16 
    # subnets within the same VPC can communicate to each other using private IP addresses
# security group 
    # security for EC2 instance (similar to a firewall) (stateful)
    # specify ingress (incoming) and egress (outgoing) traffic rules
    # explicitly allow traffic using rules.
        # allow ingress port 22 for ssh
        # allow egress all ports for outgoing traffic
    # best practice -- don't leave port 22 open to 0.0.0.0/0 (all IPs).


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
# instance.tf (lightsail example)
# -------------

# options (zone, instance, image, etc)
    # https://www.terraform.io/docs/providers/aws/r/lightsail_instance.html

resource "aws_lightsail_instance" "my_app" {
  name = "my_app" # required by lightsail instance
  availability_zone = "us-east-1a" # zone to create instance in
  blueprint_id = "ubuntu_18_04" # id for virtual private server image
  bundle_id = "string" # the bundle of specification info
  key_pair_name = "some_key_name" # the name of your key pair (created in lightsail console)
  tags = {
    foo = "bar" # optional mapping of tags to assign to the resource
  }
}

# -------------
# example docker setup/run script
# -------------

#!/bin/bash

# install latest version of docker the lazy way
curl -sSL https://get.docker.com | sh

# make it so you don't need to sudo to run docker commands
usermod -aG docker ubuntu

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# copy the dockerfile into /srv/docker 
# if you change this, change the systemd service file to match
# WorkingDirectory=[whatever you have below]
mkdir /srv/docker
curl -o /srv/docker/docker-compose.yml https://raw.githubusercontent.com/mikegcoleman/todo/master/docker-compose.yml

# copy in systemd unit file and register it so our compose file runs 
# on system restart
curl -o /etc/systemd/system/docker-compose-app.service https://raw.githubusercontent.com/mikegcoleman/todo/master/docker-compose-app.service
systemctl enable docker-compose-app

# start up the application via docker-compose
docker-compose -f /srv/docker/docker-compose.yml up -d






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





# -------------
# 
# -------------





# -------------
# 
# -------------





