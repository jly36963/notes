# ---
# Variables
# ---

# None

# ---
# Commands
# ---

.PHONY: install dev run test

install:
	@mkdir -p .venv; pipenv install --dev

dev:
	@pipenv run python3 main.py
	
run:
	@PYTHON_ENV=production pipenv run python3 main.py

test:
	pipenv run nose2 --with-coverage
