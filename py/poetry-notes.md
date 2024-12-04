# Poetry

## Example pyproject.toml

```toml
[tool.poetry]
name = "my_project"
version = "0.1.0"
description = ""
authors = [""]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.13"
pandas = "2.2.3"
requests = "2.32.3"

[tool.poetry.group.dev.dependencies]
ruff = "0.8.1"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.ruff.lint]
extend-select = ["I", "W", "D"]

[tool.ruff.lint.per-file-ignores]
"tests/*" = ["D"]

[tool.ruff.lint.pydocstyle]
convention = "numpy"
```

## CLI

```sh
# Default to using `.venv`
poetry config virtualenvs.in-project true
# New project
poetry new
# Interactive prompt for pyproject.toml creation
poetry init
# Add a dependency
poetry add pandas
poetry add pandas@^2.2.3
# Install deps
poetry install
poetry install --dev # with dev deps
# Update lockfile
poetry lock
# Run
poetry run python3 main.py

```
