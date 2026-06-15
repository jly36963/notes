# ---
# Variables
# ---

# None

# ---
# Commands
# ---

.PHONY: install dev run

install:
	mkdir -p .venv
	pipenv install --dev

dev:
	pipenv run python3 main.py

run:
	PYTHON_ENV=production pipenv run python3 main.py
