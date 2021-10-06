# go-pg

## install

```bash
go get github.com/go-pg/migrations/v8
go get github.com/go-pg/pg/v10
go get github.com/joho/godotenv
```

## startup

```bash
# run
make run
# build / run
make build; make run-build
```

## create migration

### naming

- create file in migrations directory
- name file like `<date>_<my_migration_name>`

### new migration template

```go
package main

import (
	"fmt"
	"github.com/go-pg/migrations/v8"
)

func init() {
	migrations.MustRegisterTx(up, down)
}

func up(db migrations.DB) error {
	// up logic
}

func down(db migrations.DB) error {
	// down logic
}
```
