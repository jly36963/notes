# ---
# variables
# ---

# KNEX = node_modules/.bin/knex

ENTRY="main.go"
OUTPUT="bin/app.exe"

# ---
# commands
# ---

dev:
	go run $(ENTRY)

run:
	go run $(ENTRY)

build:
	go build -o $(OUTPUT)

run-build:
	./$(OUTPUT)

lint:
	go fmt ./...

install:
	go get -d ./...


