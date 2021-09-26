# --------------------
# AWS (2019) (CLI)
# --------------------

# --------------------
# configure
# --------------------

# setup (requires pip/python3)
sudo apt-get update
sudo apt-get upgrade
pip install awscli --upgrade --user
aws --version

# configure
# IAM > users > security credentials > create access key (IMPORTANT: ONLY SHOWN ONCE)
# download key (.csv)
aws configure
# enter access key id, secret access key, region (us-east-1)
    # this will create files in ~/.aws (config, credentials)

# --------------------
# configure (multiple profiles)
# --------------------

# for multiple users (in config & credentials files)
    # https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

# set up profiles
aws configure --profile user1

# set default profile until end of shell session
export AWS_PROFILE=user1

# run single command with specific profile
aws s3 ls --profile user1 

# --------------------
# CLI -- S3
# --------------------

# ls
aws s3 ls # list buckets owned by user
aws s3 ls s3://mybucketname # list contents inside bucket
# cp
aws s3 cp s3://mybucketname/filename.txt ./filename.txt # copy file from s3 to local
aws s3 cp ./filename.txt s3://mybucketname/filename.txt # copy file from local to s3
# mb
aws s3 mb s3://unique-bucket-name # make bucket
aws s3 rb s3://unique-bucket-name # remove bucket
# sync
aws s3 sync s3://oldbucket s3://newbucket # move contents to new bucket


# --------------------
# CLI -- EC2
# --------------------

# don't put your personal credentials on an EC2. IT IS SUPER INSECURE
# use IAM roles -- EC2 instance can do whatever you allow it to (policy)
    # iam > roles > create role > aws service > ec2 > attach policies
    # ec2 > instances > right click > instance settings > attach IAM role
# ssh into ec2 instance
    # 'aws configure' -- do not enter key id, secret access key. enter region name.
    # start running AWS CLI commands


# metadata
    # get an EC2 instance to learn about itsself
curl http://169.254.169.254/latest/meta-data/
curl http://169.254.169.254/latest/user-data/

# dry-run

# dry running -- see if command will work, without running it.
    # see if permissions are configured such that the command would hypothetically work.
run-instances --dry-run --image-id ami-06340c8c12baa6a09 --instance-type t2.micro

# decode error messages
    # you can also add an STS permission to policy (DecodeAuthorizationMessage)
    # format json -- in vscode, ctrl+shift+p 'format selection'
aws sts decode-authorization-message --encoded-message c5a1b65c165_6a5b15a1b6a1ba5b61

# display available EC2 images (ubuntu)
aws ec2 describe-images | grep ubuntu 



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



# --------------------
# 
# --------------------



