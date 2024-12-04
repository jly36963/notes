# uv

## Reference

- [install](https://docs.astral.sh/uv/getting-started/installation/)
- [docs](https://docs.astral.sh/uv/)
- [CLI docs](https://docs.astral.sh/uv/reference/cli/)
- [Rules](https://docs.astral.sh/ruff/rules/)

## Example config

pyproject.toml

```toml
[project]
name = 'uv-notes'
version = "0.1.0"
requires-python = ">=3.13"
dependencies = [
    "numpy>=2.1.3",
    "pandas>=2.2.3",
    "seaborn>=0.13.2",
]

[tool.uv]
dev-dependencies = ["ruff", "pylint"]

[tool.ruff.lint]
extend-select = [
    "I",    # isort
    "W",    # warning
    "E",    # error
    "D",    # pydocstyle
    "UP",   # pyupgradee
    "B",    # flake8-bugbear
    "SIM",  # flake8-simplify
    "F",    # pyflakes
    "S",    # flake8-bandit
    "A",    # flake8-builtins
    "C4",   # flake8-comprehensions
    "TCH",  # flake8-type-checking
    "PTH",  # flake8-use-pathlib
    "PL",   # pylint
    "PERF", # perflint
    "FURB", # refurb
    "RUF",  # ruff-specific
    # "RET", # flake8-return
]

[tool.pyright]
typeCheckingMode = "basic"
```

## CLI

```sh
# Install python binary
uv python install 3.13
# Update uv
uv self update
# Create project
uv init
# Create virtual env
uv venv .venv
# Add deps (adds to pyproject toml and installs)
uv add pandas
# Install deps
uv sync
# Update lockfile
uv lock
# Run project
uv run python3 main.py
```
