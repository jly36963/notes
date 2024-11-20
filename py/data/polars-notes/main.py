"""Polars notes."""

from io import StringIO
from typing import Iterable, TypedDict, TypeVar  # noqa: UP035

import numpy as np
import polars as pl

# ---
# About
# ---

# polars user guide
# https://pola-rs.github.io/polars-book/user-guide/introduction.html

# py-polars
# https://pola-rs.github.io/polars/py-polars/html/reference/


# ---
# Types
# ---


class Ninja(TypedDict):
    """TODO."""

    id: str
    first_name: str
    last_name: str
    age: int


def _get_ninjas() -> list[Ninja]:
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


# ---
# Main
# ---


def main():
    """Run polars examples."""
    examples = {
        # Series
        "series basics": _series_basics,
        "series selection": _series_selection,
        "series rounding": _series_rounding,
        "series aggregation": _series_aggregation,
        "series string": _series_string,
        "series comparison": _series_comparison,
        "series math": _series_math,
        "series stats": _series_stats,
        "series discrete math": _series_discrete_math,
        "series missing data": _series_missing_data,
        "series type casting": _series_type_casting,
        "series updating": _series_updating,
        # Dataframe
        "dataframe creation": _dataframe_creation,
        "dataframe attributes": _dataframe_attributes,
        "dataframe indexing": _dataframe_indexing,
        "dataframe boolean mask": _dataframe_boolean_mask,
        "dataframe select expressions": _dataframe_select_expressions,
        "dataframe updating": _dataframe_updating,
        "dataframe iterating": _dataframe_iterating,
        "dataframe merge": _dataframe_merge,
        "dataframe concat": _dataframe_concat,
        "dataframe group by": _dataframe_group_by,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


# ---
# Utils
# ---

T = TypeVar("T")


def chunk(list_: list[T], size: int) -> list[list[T]]:
    """Split array into chunks of a specified size. Remainder will be in final chunk."""
    return [list_[i: i + size] for i in range(0, len(list_), size)]  # fmt: skip


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"# {string.upper()}")
    print("# ---\n")


def pretty_print_results(results: dict) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        match v:
            case pl.Series():
                print(k, type(v), v.to_list(), sep="\n")
                print()
            case _:
                print(k, type(v), v, sep="\n")
                print()


# ---
# Examples (Series)
# ---


def _series_basics():
    s1 = pl.Series("s1", range(1, 6))

    pretty_print_results(
        {
            "s1": s1,
            "s1.name": s1.name,
            "s1.dtype": s1.dtype,
            "s1.shape": s1.shape,
        }
    )


def _series_selection():
    s1 = pl.Series("s1", range(1, 6))

    pretty_print_results(
        {
            "s1": s1,
            "s1.filter(s1 > 3)": s1.filter(s1 > 3),  # noqa: PLR2004
            "s1.sample(fraction=0.5, seed=1)": s1.sample(fraction=0.5, seed=1),
            "s1.shuffle(seed=1)": s1.shuffle(seed=1),
            "s1.slice(offset=2, length=2)": s1.slice(offset=2, length=2),
            "s1.head(3)": s1.head(3),
            "s1.tail(3)": s1.tail(3),
        }
    )


def _series_rounding():
    s1 = (
        pl.Series("s1", range(1, 10))
        .cast(pl.Float64)
        .map_elements(lambda x: round(x * 1.1, 1))
    )
    pretty_print_results(
        {
            "s1": s1,
            "s1.ceil()": s1.ceil(),
            "s1.floor()": s1.floor(),
            "s1.round(0)": s1.round(0),
            "s1.clip(3, 7)": s1.clip(3, 7),
        }
    )


def _series_aggregation():
    s1 = pl.Series("s1", range(1, 6)).cast(pl.Float64)
    print("s1:", s1.to_list())
    print("max:", s1.max())
    print("min:", s1.min())
    print("mean:", s1.mean())
    print("median:", s1.median())
    print("mode(extend 3s):", s1.cast(pl.Int32).extend_constant(3, 2).mode().to_list())
    print("sum:", s1.sum())
    print("product:", s1.product())
    print("std:", s1.std())
    print("var:", s1.var())
    print("quantile(.5):", s1.quantile(0.5))


def _series_string():
    names = ["Kakashi", "Iruka", "Yamato", "Itachi", "Hiruzen"]
    srs = pl.Series("names", names)

    pretty_print_results(
        {
            "srs": srs,
            'srs.str.contains("a")': srs.str.contains("a"),
            'srs.str.ends_with("i")': srs.str.ends_with("i"),
            'srs.str.starts_with("I")': srs.str.starts_with("I"),
            "srs.str.len_bytes()": srs.str.len_bytes(),
            "srs.str.len_chars()": srs.str.len_chars(),
            'srs.str.replace("shi", " Sensei")': srs.str.replace("shi", " Sensei"),
            "srs.str.to_lowercase()": srs.str.to_lowercase(),
            "srs.str.to_titlecase()": srs.str.to_titlecase(),
            "srs.str.to_uppercase()": srs.str.to_uppercase(),
        }
    )


def _series_comparison():
    s1 = pl.Series("s1", range(1, 6))
    s2 = pl.Series("s2", list(reversed(range(1, 6))))

    pretty_print_results(
        {
            "s1": s1,
            "s2": s2,
            "s1.gt(3)": s1.gt(3),
            "s1.gt(s2)": s1.gt(s2),
            "s1.ge(3)": s1.ge(3),
            "s1.ge(s2)": s1.ge(s2),
            "s1.lt(3)": s1.lt(3),
            "s1.lt(s2)": s1.lt(s2),
            "s1.le(3)": s1.le(3),
            "s1.le(s2)": s1.le(s2),
            "s1.eq(3)": s1.eq(3),
            "s1.eq(s2)": s1.eq(s2),
            "s1.eq_missing(s2)": s1.eq_missing(s2),
            "s1.ne(3)": s1.ne(3),
            "s1.ne(s2)": s1.ne(s2),
            "s1.ne_missing(s2)": s1.ne_missing(s2),
            "s1.is_in([2, 3, 4])": s1.is_in([2, 3, 4]),
            "s1.is_in(s2)": s1.is_in(s2),
            "s1.gt(s2).any()": s1.gt(s2).any(),
            "s1.gt(0).all()": s1.gt(0).all(),
        }
    )


def _series_math():
    values = np.round(np.random.randn(5), 3)
    s1 = pl.Series(values)

    # math methods
    pretty_print_results(
        {
            "s1": s1,
            "s1.abs()": s1.abs(),
            "s1.clip(2, 4)": s1.clip(2, 4),
            "s1.round(2)": s1.round(2),
            "np.ceil(s1)": np.ceil(s1),
            "np.floor(s1)": np.floor(s1),
            "s1 + 1": s1 + 1,
            "s1 + s1": s1 + s1,
            "s1 - 2": s1 - 2,
            "s1 - s1": s1 - s1,
            "s1 * 2": s1 * 2,
            "s1 * s1": s1 * s1,
            "s1 / 2": s1 / 2,
            "s1 / s1": s1 / s1,
            "s1**2": s1**2,
            "s1**s1": s1**s1,
        }
    )


def _series_stats():
    values = np.round(np.random.randn(5), 3)
    srs = pl.Series(values)

    pretty_print_results(
        {
            "srs": srs,
            "srs.count()": srs.count(),
            "srs.sum()": srs.sum(),
            "srs.max()": srs.max(),
            "srs.min()": srs.min(),
            "srs.mean()": srs.mean(),
            "srs.mode()": srs.mode(),
            "srs.std()": srs.std(),
            "srs.var()": srs.var(),
        }
    )


def _series_discrete_math():
    s1 = pl.Series("s1", range(1, 6))
    s2 = pl.Series("s2", list(reversed(range(1, 6))))
    joined = pl.concat([s1, s2])

    def intersection(i1: Iterable[T], i2: Iterable[T]) -> list[T]:
        return list(set(i1).intersection(i2))

    def union(i1: Iterable[T], i2: Iterable[T]) -> list[T]:
        return list(set(i1).union(i2))

    def diff(i1: Iterable[T], i2: Iterable[T]) -> list[T]:
        return list(set(i1).difference(i2))

    def symmetric_diff(i1: Iterable[T], i2: Iterable[T]) -> list[T]:
        return list(set(i1).symmetric_difference(i2))

    pretty_print_results(
        {
            "s1": s1,
            "s2": s2,
            "joined": joined,
            "intersection(s1, [2, 3, 4])": intersection(s1, [2, 3, 4]),
            "union(s1, [0, 1, 2])": union(s1, [0, 1, 2]),
            "diff(s1, [2, 3, 4])": diff(s1, [2, 3, 4]),
            "symmetric_diff(s1, [0, 1, 2])": symmetric_diff(s1, [0, 1, 2]),
            "s1.is_in([2, 3, 4])": s1.is_in([2, 3, 4]),
            "s1.is_in(s2)": s1.is_in(s2),
            "joined.is_duplicated()": joined.is_duplicated(),
            "joined.unique()": joined.unique(),
            "s1.is_unique()": s1.is_unique(),
        }
    )


def _series_missing_data():
    s1 = pl.Series([0, None, 2, None, 4, None])
    s2 = pl.Series(range(0, 6))

    # NOTE: null/nan are different in polars

    pretty_print_results(
        {
            "s1": s1,
            "s2": s2,
            "s1.null_count()": s1.null_count(),
            "s1.has_nulls()": s1.has_nulls(),
            "s1.is_null()": s1.is_null(),
            "s1.is_not_null()": s1.is_not_null(),
            "s1.fill_null(strategy='backward')": s1.fill_null(strategy="backward"),
            "s1.fill_null(strategy='forward')": s1.fill_null(strategy="forward"),
            "s1.fill_null(0)": s1.fill_null(0),
            "s1.fill_null(s2)": s1.fill_null(s2),
            "s1.interpolate()": s1.interpolate(),
            "s1.drop_nulls()": s1.drop_nulls(),
            "s1.filter(~s1.is_null())": s1.filter(~s1.is_null()),
        }
    )


def _series_type_casting():
    s1 = pl.Series(range(1, 6))

    pretty_print_results(
        {
            "s1": s1,
            "s1.cast(pl.Float64)": s1.cast(pl.Float64),
        }
    )


def _series_updating():
    s1 = pl.Series(range(1, 6))
    s2 = pl.Series(list(reversed(range(1, 6))))

    # `where` vs `mask`:
    # where: where true, keep original
    # mask: where true, replace with fallback

    pl.select(pl.when(s1.lt(3)).then(s2).otherwise(s1))

    def execute_expr(expr: pl.Expr) -> pl.Series:
        return pl.select(expr).to_series()

    pretty_print_results(
        {
            "s1": s1,
            "s2": s2,
            "execute_expr(pl.when(s1.lt(3)).then(s2).otherwise(s1))": execute_expr(
                pl.when(s1.lt(3)).then(s2).otherwise(s1)
            ),
        }
    )


# ---
# Examples (DataFrame)
# ---

# Conversion: to_arrow, to_frame, to_list, to_numpy, to_pandas


def _dataframe_creation():
    ninjas = _get_ninjas()

    df_from_records = pl.DataFrame(ninjas)
    # json
    ninjas_json = df_from_records.write_json()
    df_from_json = pl.read_json(StringIO(ninjas_json))
    # csv
    ninjas_csv = df_from_json.write_csv()
    df_from_csv = pl.read_csv(StringIO(ninjas_csv))
    # dict[str, list]
    ninjas_dict = df_from_csv.to_dict(as_series=False)
    df_from_dict = pl.DataFrame(ninjas_dict)
    # list[dict]
    ninjas_records = df_from_dict.to_dicts()

    # Also: to_excel, read_excel
    pretty_print_results(
        {
            "ninjas_json": ninjas_json,
            "ninjas_csv": ninjas_csv,
            "ninjas_dict": ninjas_dict,
            "ninjas_records": ninjas_records,
        }
    )


def _dataframe_attributes():
    df = pl.DataFrame(_get_ninjas())

    pretty_print_results(
        {
            "df.columns": df.columns,
            "df.dtypes": df.dtypes,
            "df.height": df.height,
            "df.width": df.width,
            "df.shape": df.shape,
            "df.schema": df.schema,
            "df.describe()": df.describe(),
            "df.is_empty()": df.is_empty(),
            'df.estimated_size("kb")': np.round(df.estimated_size("kb"), 2),
        }
    )


def _dataframe_indexing():
    df = pl.DataFrame(_get_ninjas())

    def _get_row(df: pl.DataFrame, idx: int) -> dict:
        return dict(zip(df.columns, df.row(idx), strict=True))

    pretty_print_results(
        {
            "df": df,
            "df.row(0)": df.row(0),
            "_get_row(df, 0)": _get_row(df, 0),
            "df.slice(1, 2)": df.slice(1, 2),
            'df.get_column("first_name")': df.get_column("first_name"),
            'df.select(pl.col(["first_name", "last_name"]))': df.select(
                pl.col(["first_name", "last_name"])
            ),
            'df[0, "first_name"]': df[0, "first_name"],
            "df.sample(fraction=0.5)": df.sample(fraction=0.5),
        }
    )


def _dataframe_boolean_mask():
    df = pl.DataFrame(_get_ninjas())
    df = df.with_columns(pl.lit("Leaf").alias("village"))

    pretty_print_results(
        {
            "df": df,
            'df.filter(pl.col("age").eq(25))': df.filter(pl.col("age").eq(25)),
            'df.filter(pl.col("age").gt(21) & pl.col("age").lt(27))': df.filter(
                pl.col("age").gt(21) & pl.col("age").lt(27)
            ),
            'df.filter(pl.col("age").le(21) | pl.col("age").ge(27))': df.filter(
                pl.col("age").le(21) | pl.col("age").ge(27)
            ),
            'df.filter(pl.col("village").ne(pl.lit("Leaf")))': df.filter(
                pl.col("village").ne(pl.lit("Leaf"))
            ),
            'df.filter(pl.col("first_name").str.contains("k"))': df.filter(
                pl.col("first_name").str.contains("k")
            ),
        }
    )


def _dataframe_select_expressions():
    df = pl.DataFrame(_get_ninjas())

    # def clean_id(val: str) -> str:
    #     return val.upper().strip().replace("-", "")

    df = df.select(
        pl.col("id"),
        pl.col("first_name").str.to_lowercase(),
        pl.col("last_name").str.to_uppercase(),
        pl.col("age").add(pl.lit(2)),
        pl.lit("Leaf").alias("village"),
        # # Slow, use "map_elements" as last resort
        # pl.col("id").alias("id2").map_elements(clean_id, return_dtype=pl.String),
    )

    pretty_print_results({"df": df})


def _dataframe_updating():
    df = pl.DataFrame(_get_ninjas())

    df = df.with_columns(pl.lit("Leaf").alias("village"))
    df = df.drop("village")
    df = df.rename({"first_name": "firstName", "last_name": "lastName"})
    df = df.sort(by=["lastName", "firstName"])  # `descending=[True, True]`

    pretty_print_results({"df": df})


def _dataframe_iterating():
    df = pl.DataFrame(_get_ninjas())

    # iter_rows (tuple)
    cols = pl.col(["id", "first_name", "last_name", "age"])
    for uid, fn, ln, age in df.select(cols).iter_rows():
        print(uid, fn, ln, age)

    # # iter_rows (dict)
    # for row in df.select(cols).iter_rows(named=True):
    #     print(row)


def _dataframe_merge():
    df1 = pl.DataFrame(_get_ninjas())
    df2 = pl.DataFrame(
        [
            {"first_name": "Kakashi", "village": "Leaf", "rank": "Jonin"},
            {"first_name": "Tenzo", "village": "Leaf", "rank": "Jonin"},
            {"first_name": "Iruka", "village": "Leaf", "rank": "Chunin"},
            {"first_name": "Itachi", "village": "Leaf", "rank": "Jonin"},
        ]
    )

    df = df1.join(df2, how="left", on="first_name", coalesce=True)

    pretty_print_results({"df": df})


def _dataframe_concat():
    df = pl.DataFrame(_get_ninjas())
    df1 = df.head(2)
    df2 = df.tail(2)

    df = pl.concat([df1, df2])
    # # Also
    # df = df1.vstack(df2)

    pretty_print_results({"df": df})


def _dataframe_group_by():
    df = pl.DataFrame(
        [
            {"date": "2024-01-02", "amount": 100},
            {"date": "2024-01-02", "amount": 110},
            {"date": "2024-01-02", "amount": 90},
            {"date": "2024-01-02", "amount": 120},
            {"date": "2024-01-03", "amount": 120},
            {"date": "2024-01-03", "amount": 110},
            {"date": "2024-01-03", "amount": 90},
            {"date": "2024-01-03", "amount": 100},
            {"date": "2024-01-03", "amount": 95},
        ]
    )

    # Add new column with aggregation per group
    df_with_avg = df.with_columns(
        pl.col("amount").mean().over("date").alias("avg_amount_per_date")
    )

    # Iterate through groups (group_by)
    for group_labels, group_df in df.group_by("date"):
        (dash_date,) = group_labels
        print(dash_date, len(group_df))

    # Iterate through groups (partition_by)
    for group_df in df.partition_by("date"):
        print(len(group_df))

    # Aggregate
    min_per_date = df.sort(by="amount", descending=False).group_by("date").first()
    max_per_date = df.sort(by="amount", descending=True).group_by("date").first()
    count_per_date = df.group_by("date").len()

    pretty_print_results(
        {
            "df": df,
            "df_with_avg": df_with_avg,
            "min_per_date": min_per_date,
            "max_per_date": max_per_date,
            "count_per_date": count_per_date,
        }
    )


if __name__ == "__main__":
    main()
