# Conda

```sh
# Create conda env
conda create --name [name_of_environment]
# Create conda env (with package included)
conda create -n [name_of_environment] [package_to_install]
# Create conda env with specific python version
conda create --name [name_of_environment] python=3.11

# List all conda environments
conda env list
# Activate conda env
conda activate [name_of_environment]
# Deactivate current conda env
conda deactivate

# Install python package (while in active env)
pip3 install [package]
# Install package (while in active env)
conda install [package]
```
