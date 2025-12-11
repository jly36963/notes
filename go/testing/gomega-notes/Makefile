# ---
# variables
# ---

ENTRY="main.go"
OUTPUT="bin/app.exe"

# ---
# commands
# ---

.PHONY: dev run build run-build lint install test

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

test:
	ginkgo -r


