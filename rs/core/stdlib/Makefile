# ---
# variables
# ---

# TODO

# --- 
# commands
# --- 

.PHONY: dev dev-build build run-example

# creates (and runs) executable in ./target/debug/<project-name>
dev: 
	@cargo run

# creates executable in ./target/debug/<project-name>
dev-build: 
	@cargo build

# creates executable in ./target/release/<project-name>
build: 
	@cargo build --release

# run example script to test api
run-rest-example:
	@cargo run --bin example

run-example:
	@npm run run-example

