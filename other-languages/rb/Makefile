# ---
# Variables
# ---

ENTRY="main.rb"

# ---
# Commands
# ---

.PHONY: install run lint format

install:
	bundle install

run:
	ruby $(ENTRY)

lint:
	srb tc

format:
	rubocop -a
