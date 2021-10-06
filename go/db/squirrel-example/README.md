# squirrel

- squirrel: https://github.com/Masterminds/squirrel
- pgx: https://github.com/jackc/pgx
- migrate: 
  - https://github.com/golang-migrate/migrate
  - https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md
  - https://github.com/golang-migrate/migrate/blob/master/MIGRATIONS.md

## install

```bash
go get -u "github.com/Masterminds/squirrel"
go get -u "github.com/jackc/pgx/v4"
brew install golang-migrate
```

## startup

```bash
# run
make run
# build / run
make build; make run-build
```
