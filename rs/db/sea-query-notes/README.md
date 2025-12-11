# Sea Query

## Startup

```bash
just dev
```

## migrations

- https://github.com/launchbadge/sqlx/tree/master/sqlx-cli
- https://crates.io/crates/sqlx-cli

```bash
# install sqlx-cli
cargo install sqlx-cli --no-default-features --features postgres
# set database url (required when using sqlx-cli)
export DATABASE_URL="postgres://postgres:postgres@localhost:5432/practice"
# create database
sqlx db create
# create migration (creates new file in migrations/<timestamp>-<name>.sql)
sqlx migrate add -r <name>
# run migrations
sqlx migrate run
# revert migration
sqlx migrate revert
```
