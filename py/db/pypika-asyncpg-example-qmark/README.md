# pypika-example

- pypika: https://github.com/kayak/pypika
- asyncpg: https://github.com/MagicStack/asyncpg
- psycopg2: https://github.com/psycopg/psycopg2 (only for sqlalchemy + alembic migrations)
- alembic: https://github.com/alembic/alembic



## setup

- `make install`
- `make migrate`

## startup (dev)

- `make run`

## setting up alembic (first time only) (for my reference)

- `make init-alembic`
- configure alembic env (see below)

### configuring alembic env

in `alembic/env.py`

```py
context.config.set_main_option('sqlalchemy.url', "<connection-string>")
```

running alembic commands (add to python path)

```bash
PYTHONPATH=. alembic upgrade head
```