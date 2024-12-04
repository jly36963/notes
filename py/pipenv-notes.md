# Pipenv

## Example Pipfile

```toml
[[source]]
url = "https://pypi.org/simple"
verify_ssl = true
name = "pypi"

[packages]
pandas = "*"
numpy = "*"
seaborn = "*"
matplotlib = "*"

[dev-packages]
pylint = "*"
ruff = "*"

[requires]
python_version = "3.12"
```

## Setup and usage

```sh
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
```
