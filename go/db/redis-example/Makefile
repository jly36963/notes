# ---
# variables
# ---

# go
ENTRY="main.go"
OUTPUT="bin/app.exe"

# ---
# commands
# ---

.PHONY: dev run build run-build prettier install

default:
	install build run-build

dev: 
	air

run: 
	go run $(ENTRY)

build: 
	go build -o $(OUTPUT)

run-build:
	./$(OUTPUT)

prettier: 
	go fmt ./...

install: 
	go get -d ./...



