# python setup

# set up conda env (and start)

# install pip3
sudo apt update
sudo apt install python3-pip  
# install gcc
sudo apt install 
# prepare for psycopg2
sudo apt install libpq-dev python3-dev

# python packages
pip3 install \
    numpy pandas scipy statsmodels \
    matplotlib seaborn \
    flask jupyterlab \
    scikit-learn tensorflow \
    psycopg2 pymongo mongoengine SQLAlchemy boto3

# pytorch
pip3 install torch==1.5.0+cpu torchvision==0.6.0+cpu -f https://download.pytorch.org/whl/torch_stable.html