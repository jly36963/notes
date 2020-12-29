
# ---
# pyenv
# ---

# install pyenv
brew install pyenv
# install python
pyenv install -v 3.6.5
# uninstall
pyenv uninstall 3.6.5
# list versions
pyenv versions
# which
pyenv which python
# use version (global)
pyenv global 3.6.5
pyenv global system
# use version (local)
pyenv local 3.6.5
pyenv local system

# ---
# pipenv
# ---

# install pipenv
pip3 install pipenv

# to install deps in current directory, do either:
    # PIPENV_VENV_IN_PROJECT=true 
    # create `.venv` folder

# install package
pipenv install numpy

# start shell
pipenv shell

# start script
pipenv run python3 app.py

