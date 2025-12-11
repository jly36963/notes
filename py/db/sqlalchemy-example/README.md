# sqlalchemy

## todo

- figure out why related data is missing
- double check soft delete logic

## setup

- `make install`
- `make migrate`

## startup (dev)

- `make dev`

## startup (prod)

- `make run`

## setting up alembic (first time only) (for my reference)

- `make init-alembic`
- configure alembic env (see below)

### configuring alembic env

in `alembic/env.py`

```py
# set connection string
from connections.pg import connection_string
context.config.set_main_option('sqlalchemy.url', connection_string)
```

running alembic commands (add to python path)

```bash
PYTHONPATH=. alembic upgrade head
```
