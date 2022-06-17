# ---
# variables
# ---

# None

# ---
# commands
# ---

.PHONY: lint fmt test dev build run

lint:
	@deno lint

fmt:
	@deno fmt

# test:
# 	@deno test

dev:
	@deno run  --allow-all --watch mod.ts

build:
	@mkdir -p build
	@deno bundle mod.ts ./build/mod.js
	
run:
	@deno run --allow-all ./build/mod.js