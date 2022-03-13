# async-graphql + warp + tokio-postgres

- async-graphql
  - https://github.com/async-graphql/async-graphql

- warp
  - https://github.com/seanmonstar/warp
  - https://docs.rs/warp/0.3.2/warp/

- tokio-postgres
  - https://github.com/sfackler/rust-postgres
  - https://docs.rs/tokio-postgres/0.7.5/tokio_postgres/

- reqwest
  - https://github.com/seanmonstar/reqwest
  - https://github.com/seanmonstar/reqwest/tree/master/examples
  - https://docs.rs/reqwest/0.11.6/reqwest/

## Startup

```bash
# start dev server
make dev
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

### additional migration docs/issues

- https://github.com/launchbadge/sqlx/issues/356
- https://github.com/launchbadge/sqlx/issues/1306