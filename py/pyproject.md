# pyproject

Modern equivalent of setuptools.

Docs:

- [Pip](https://pip.pypa.io/en/stable/reference/build-system/pyproject-toml/)
- [Pypa](https://setuptools.pypa.io/en/latest/userguide/pyproject_config.html)
- [Poetry](https://python-poetry.org/docs/pyproject/)

## Example

```toml
# Build system: TODO
# If table not provided, build-system will default to below (pip v23.2.1)
[build-system]
requires = ["setuptools>=40.8.0", "wheel"]
build-backend = "setuptools.build_meta:__legacy__"

# Project: metadata about project
[project]
name = "example_project"
verson = "0.1.0"
authors = [{ name = "Patrick Star" }]
description = "My example project description"
readme = "README.md"
requires-python = ">=3.10"
keywords = ['tag1', 'tag2']
license = "MIT"
classifiers = ["Development Status :: 1 - Planning"]
dependencies = ['httpx', 'polars', 'schema']
```
