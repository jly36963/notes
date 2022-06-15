# ---
# Variables
# ---

PG_MIGRATE_URL="pgx://postgres:postgres@localhost:5432/practice"
MIGRATIONS_PATH="./dal/pg/migrations"

# ---
# Commands
# ---

.PHONY: lint fmt test dev build run

install:
	@npm i

lint:
	@deno lint

fmt:
	@deno fmt

# test:
# 	@deno test

dev:
	@deno run  --allow-all --watch --compat --unstable mod.ts

build:
	@mkdir -p build
	@deno bundle mod.ts ./build/mod.ts
	
run:
	@deno run --allow-all ./build/mod.ts

# ---
# Migrations
# ---

migrate:
	migrate -database $(PG_MIGRATE_URL) -path $(MIGRATIONS_PATH) up

rollback:
	migrate -database $(PG_MIGRATE_URL) -path $(MIGRATIONS_PATH) down

migration:
	@echo "Enter migration name"; \
	read NAME; \
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $$NAME;