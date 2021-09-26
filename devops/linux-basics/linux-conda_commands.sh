
# CONDA

# create conda env
conda create --name [name_of_environment]
# create conda env (with package included)
conda create -n [name_of_environment] [package_to_install]
# create conda env with specific python version
conda create --name [name_of_environment] python=3.5

# list all conda environments
conda env list
# activate conda env
conda activate [name_of_environment]
# deactivate current conda env
conda deactivate

# install python package (while in active env)
pip3 install [package]
# install package (while in active env)
conda install [package]

