# pypika-example

- pypika: https://github.com/kayak/pypika
- psycopg2: https://github.com/psycopg/psycopg2
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
