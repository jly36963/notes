# ---
# variables
# ---

# go
ENTRY="main.go"
OUTPUT="bin/app.exe"

# migrations
PG_MIGRATE_URL="pgx://postgres:postgres@localhost:5432/practice"
MIGRATIONS_PATH="./dal/pg/migrations"

# ---
# commands
# ---

.PHONY: dev run build run-build prettier install \
	migrate rollback migration

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

lint: 
	go fmt ./...

install: 
	go get -d ./...

# ---
# migrations
# ---

migrate:
	migrate -database $(PG_MIGRATE_URL) -path $(MIGRATIONS_PATH) up

rollback:
	migrate -database $(PG_MIGRATE_URL) -path $(MIGRATIONS_PATH) down

migration:
	@echo "Enter migration name"; \
	read NAME; \
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $$NAME;


