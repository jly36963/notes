"""Pandas notes."""

# ruff: noqa: S608

from typing import cast

import duckdb
from duckdb import DuckDBPyConnection
from pandas import DataFrame

# ---
# Types
# ---


def _get_ninjas() -> list[dict]:
    return [
        {
            "id": "fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6",
            "first_name": "Kakashi",
            "last_name": "Hatake",
            "age": 27,
        },
        {
            "id": "2c6c74c3-b9d6-4d49-a113-4f1a8164abe3",
            "first_name": "Tenzo",
            "last_name": "Yamato",
            "age": 26,
        },
        {
            "id": "2e9093d5-f466-40bb-be14-993276f0a497",
            "first_name": "Iruka",
            "last_name": "Umino",
            "age": 25,
        },
        {
            "id": "71547b9d-f28e-4511-b767-860bc37f148f",
            "first_name": "Itachi",
            "last_name": "Uchiha",
            "age": 21,
        },
    ]


def _get_ninjas_dict() -> dict[str, list]:
    records = _get_ninjas()
    result = _records_to_dict(records)
    return result


def _records_to_dict(records: list[dict]) -> dict[str, list]:
    df = DataFrame(records)
    result = df.to_dict(orient="list")
    return cast("dict[str, list]", result)


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"# {string.upper()}")
    print("# ---\n")


def pretty_print_results(results: dict) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k, type(v), v, sep="\n")
        print()


# ---
# Utils (DB)
# ---


def _create_ninjas_table(conn: DuckDBPyConnection) -> str:
    tbl = "ninjas"
    sql = f"CREATE TABLE {tbl} (id UUID, first_name VARCHAR, last_name VARCHAR, age INTEGER)"
    conn.execute(sql)
    return tbl


def _drop_table(conn: DuckDBPyConnection, table: str) -> None:
    tbl = "ninjas"
    sql = f"DROP TABLE {tbl}"
    conn.execute(sql)


def _unique_keys(records: list[dict]) -> list[str]:
    seen = set()
    ordered_keys = []

    for record in records:
        for key in record:
            if key not in seen:
                seen.add(key)
                ordered_keys.append(key)

    return ordered_keys


def _insert_tuples(
    conn: DuckDBPyConnection,
    table: str,
    cols: list[str],
    tuple_values: list,
) -> None:
    col_expr = ", ".join(cols)
    param_expr = ", ".join(["?"] * len(cols))
    sql = f"INSERT INTO {table} ({col_expr}) VALUES ({param_expr})"
    conn.executemany(sql, tuple_values)


def _insert_records(
    conn: DuckDBPyConnection,
    table: str,
    values: list[dict],
) -> None:
    cols = _unique_keys(values)
    table = "ninjas"
    tuple_values = [[v.get(c) for c in cols] for v in values]
    _insert_tuples(conn, table, cols, tuple_values)


def _insert_colums(
    conn: DuckDBPyConnection,
    table: str,
    column_values: dict[str, list],
) -> None:
    cols = list(column_values.keys())
    value_tuples = list(zip(*column_values.values(), strict=True))
    _insert_tuples(conn, table, cols, value_tuples)


# ---
# Examples
# ---


def _simple_crud_records() -> None:
    conn = duckdb.connect()
    table = _create_ninjas_table(conn)
    ninjas = cast("list[dict]", _get_ninjas())
    _insert_records(conn, table, ninjas)
    result = conn.execute(f"SELECT * FROM {table}").fetchall()
    print(result)
    _drop_table(conn, table)


def _simple_crud_dicts() -> None:
    conn = duckdb.connect()
    table = _create_ninjas_table(conn)
    column_values = _get_ninjas_dict()
    _insert_colums(conn, table, column_values)
    result = conn.execute(f"SELECT * FROM {table}").fetchall()
    print(result)
    _drop_table(conn, table)


def _simple_read_csv() -> None:
    conn = duckdb.connect()
    sql = "SELECT * FROM read_csv_auto('./data/input/ninjas.csv')"
    result = conn.execute(sql).fetchall()
    print(result)


def _simple_read_json() -> None:
    conn = duckdb.connect()
    sql = "SELECT * FROM read_json_auto('./data/input/ninjas.json')"
    result = conn.execute(sql).fetchall()
    print(result)


# ---
# Main
# ---


def main():
    """Run pandas examples."""
    examples = {
        "_simple_crud_records": _simple_crud_records,
        "_simple_crud_dicts": _simple_crud_dicts,
        "_simple_read_csv": _simple_read_csv,
        "_simple_read_json": _simple_read_json,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


main()
