# ---
# Variables
# ---

ENTRY="main.go"
OUTPUT="bin/app.exe"

# ---
# Commands
# ---

.PHONY: run build run-build lint install

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


