# -----------
# setup -- digits & tf
# -----------

# check gpu
lspci | grep -i nvidia

# check linux dist/release
uname -m && cat /etc/*release

# verify gcc
gcc --version

# check kernel
uname -r

# kernel headers and dev packages (for currently running kernel)
sudo apt-get install linux-headers-$(uname -r)

# download and verify cuda toolkit (INSTALL FROM HERE)
# https://developer.nvidia.com/cuda-downloads
md5sum file_name

# post installation actions
# environment setup
export PATH=/usr/local/cuda-10.1/bin:/usr/local/cuda-10.1/NsightCompute-2019.1${PATH:+:${PATH}}
export LD_LIBRARY_PATH=/usr/local/cuda-10.1/lib64 ${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}
# power9
sudo cp /lib/udev/rules.d/40-vm-hotadd.rules /etc/udev/rules.d 
sudo sed -i 's/SUBSYSTEM!="memory", ACTION!="add", GOTO="memory_hotplug_end"/SUBSYSTEM=="*", GOTO="memory_hotplug_end"/' /etc/udev/rules.d/40-vm-hotadd.rules
# verify driver version
cat /proc/driver/nvidia/version
# install third party libraries
sudo apt-get install g++ freeglut3-dev build-essential libx11-dev \
    libxmu-dev libxi-dev libglu1-mesa libglu1-mesa-dev

# upgrades
sudo apt-get install cuda 
sudo apt-get install cuda-drivers

# list cuda packages
cat /var/lib/apt/lists/*cuda*Packages | grep "Package:" 

# -----------
# nvidia-docker
# -----------

# install nvidia-docker
sudo apt install nvidia-docker2

# restart docker
sudo systemctl restart docker

# use nvidia-docker
nvidia-docker run <image>

# -----------
# ngc -- nvidia digits docker image
# -----------

# go to NGC website
# create account (verify account)
# setup > get API key (write API key down, shown only once)

# authorize
docker login nvcr.io
Username: $oauthtoken
Password: <Your API Key>

# docker image pull command listed at:
# https://ngc.nvidia.com/catalog/containers/nvidia:digits

# show docker images
docker images # tag -- 19.06-tensorflow
# pull image
docker pull nvcr.io/nvidia/digits:19.06-tensorflow
# run image (nvidia-docker)
nvidia-docker run -it -p 5000:5000 -v $(pwd):/app/ nvcr.io/nvidia/digits:19.06-tensorflow
# run image (docker)
docker run --gpus all -it -p 5000:5000 -v $(pwd):/app/ nvcr.io/nvidia/digits:19.06-tensorflow

# docker compose example (runtime:nvidia)
# https://github.com/NVIDIA/nvidia-docker/wiki/Frequently-Asked-Questions#do-you-support-docker-compose
# https://github.com/NVIDIA/gpu-monitoring-tools/blob/master/exporters/prometheus-dcgm/docker/docker-compose.yml


# -----------
#  workflow
# -----------

# get images
    # consistent lighting, distance, camera angle
    # sufficient number of images
    # not too small (400x400 min)
    # DetectNet default 1392 x 512 (can be customized)
# resize
    # example script: https://www.coria.com/insights/blog/computer-vision/preparing-data-for-custom-object-detection-using-nvidia-digits
# image labeling tool (KITTI format)
# label images
# train_test_split
# import dataset into NVIDIA DIGITS
    # example params -- https://www.coria.com/insights/blog/computer-vision/preparing-data-for-custom-object-detection-using-nvidia-digits

# -----------
# preparation
# -----------

# directory structure -- https://github.com/NVIDIA/DIGITS/tree/master/digits/extensions/data/objectDetection#folder-structure
train/
├── images/
│   └── 000001.png
└── labels/
    └── 000001.txt
val/
├── images/
│   └── 000002.png
└── labels/
    └── 000002.txt

# kitti labels -- https://github.com/NVIDIA/DIGITS/tree/master/digits/extensions/data/objectDetection#label-format

 Values    Name      Description
----------------------------------------------------------------------------
   1    type         Describes the type of object: 'Car', 'Van', 'Truck',
                     'Pedestrian', 'Person_sitting', 'Cyclist', 'Tram',
                     'Misc' or 'DontCare'
   1    truncated    Float from 0 (non-truncated) to 1 (truncated), where
                     truncated refers to the object leaving image boundaries
   1    occluded     Integer (0,1,2,3) indicating occlusion state:
                     0 = fully visible, 1 = partly occluded
                     2 = largely occluded, 3 = unknown
   1    alpha        Observation angle of object, ranging [-pi..pi]
   4    bbox         2D bounding box of object in the image (0-based index):
                     contains left, top, right, bottom pixel coordinates
   3    dimensions   3D object dimensions: height, width, length (in meters)
   3    location     3D object location x,y,z in camera coordinates (in meters)
   1    rotation_y   Rotation ry around Y-axis in camera coordinates [-pi..pi]
   1    score        Only for results: Float, indicating confidence in
                     detection, needed for p/r curves, higher is better.

# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


# -----------
# 
# -----------


d