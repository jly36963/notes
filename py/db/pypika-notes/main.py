"""pypika notes."""

from pypika import NamedParameter, Parameter, Query, Table  # PostgreSQLQuery

Parameter
NamedParameter

# ---
# Main
# ---


def main():
    """Run examples."""
    examples = {
        "select": _select,
        "distinct": _distinct,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


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
# Examples
# ---


def _select():
    table = Table("my_table")
    qb = (
        Query()
        .from_(table)
        .select("*")
        .where(
            (table.date >= NamedParameter("start_date"))
            & (table.date <= NamedParameter("end_date"))
            & (table.other_id == NamedParameter("other_id"))
        )
    )
    sql = str(qb)
    args = {
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "other_id": "abcde",
    }

    pretty_print_results(
        {
            "sql": sql,
            "args": args,
        }
    )


def _distinct():
    table = Table("my_table")
    qb = (
        Query()
        .from_(table)
        .select(table.id)
        .where(
            (table.date >= NamedParameter("start_date"))
            & (table.date <= NamedParameter("end_date"))
            & (table.other_id == NamedParameter("other_id"))
        )
        .distinct()
    )
    sql = str(qb)
    args = {
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "other_id": "some-foreign-key",
    }

    pretty_print_results(
        {
            "sql": sql,
            "args": args,
        }
    )


# ---
# Run
# ---

main()
