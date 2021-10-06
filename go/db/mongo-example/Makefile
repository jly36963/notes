# ---
# variables
# ---

ENTRY="main.go"
OUTPUT="bin/app.exe"

# ---
# commands
# ---

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


