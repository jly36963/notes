
# ---
# Pyenv
# ---

# Install pyenv
brew install pyenv
# Initialize pyenv (follow steps)
pyenv init
# Install python
pyenv install -v 3.11.4
# Uninstall
pyenv uninstall 3.11.4
# List versions
pyenv versions
# Which
pyenv which python
# Use version (global)
pyenv global 3.11.4
pyenv global system
# Use version (local)
pyenv local 3.11.4
pyenv local system

# ---
# Pipenv
# ---

# Install pipenv
pip3 install pipenv

# Install package
pipenv install pandas

# Start shell
pipenv shell

# Start script
pipenv run python3 app.py

# To install from pipfile (with dev dependencies)
pipenv install --dev
# To install deps in current directory (.venv), do either:
PIPENV_VENV_IN_PROJECT=true pipenv install --dev
mkdir -p .venv; pipenv install --dev

