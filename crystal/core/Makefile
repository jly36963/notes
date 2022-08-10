# ---
# variables
# ---

ENTRY="src/main.cr"
OUTPUT="$(CURDIR)/bin/main"

# ---
# commands
# ---

.PHONY: dev run build run-build format

dev: 
	@crystal run $(ENTRY)

run: 
	@crystal run $(ENTRY)

build: 
	@crystal build $(ENTRY) -o $(OUTPUT)

run-build:
	@$(OUTPUT)

format: 
	@crystal tool format

install: 
	@echo "TODO"


