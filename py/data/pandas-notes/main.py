"""Pandas notes."""

from io import StringIO
from typing import Iterable, TypedDict, TypeVar  # noqa: UP035

import numpy as np
import pandas as pd
from numpy.random import randn

# API reference
# https://pandas.pydata.org/docs/reference/index.html

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


# ninjas_dtypes = {"id": "str", "first_name": "str", "last_name": "str", "age": "int64"}

# ---
# Main
# ---


def main():
    """Run pandas examples."""
    print_section_title("series creation")
    _series_creation()

    print_section_title("series attributes")
    _series_attributes()

    print_section_title("series indexing")
    _series_indexing()

    print_section_title("series boolean mask")
    _series_boolean_mask()

    print_section_title("series serde")
    _series_serde()

    print_section_title("series string")
    _series_string()

    print_section_title("series comparison")
    _series_comparison()

    print_section_title("series math")
    _series_math()

    print_section_title("series stats")
    _series_stats()

    print_section_title("series discrete math")
    _series_discrete_math()

    print_section_title("series missing data")
    _series_missing_data()

    print_section_title("series type casting")
    _series_type_casting()

    print_section_title("series updating")
    _series_updating()

    print_section_title("index")
    _index()

    print_section_title("dataframe creation")
    _dataframe_creation()

    print_section_title("dataframe attributes")
    _dataframe_attributes()

    print_section_title("dataframe indexing")
    _dataframe_indexing()

    print_section_title("dataframe boolean mask")
    _dataframe_boolean_mask()

    print_section_title("dataframe updating")
    _dataframe_updating()

    print_section_title("dataframe iterating")
    _dataframe_iterating()

    print_section_title("dataframe merge")
    _dataframe_merge()

    print_section_title("dataframe concat")
    _dataframe_concat()

    print_section_title("dataframe groupby")
    _dataframe_groupby()


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
        match v:
            case pd.Series():
                print(k, type(v), v.index.to_list(), v.to_list(), sep="\n")
                print()
            case _:
                print(k, type(v), v, sep="\n")
                print()


T = TypeVar("T")


def first(input_list: list[T]) -> T | None:
    """Return the first item in a list, returns None if empty."""
    if len(input_list) == 0:
        return None
    return input_list[0]


def last(input_list: list[T]) -> T | None:
    """Return the last item in a list, returns None if empty."""
    if len(input_list) == 0:
        return None
    return input_list[-1]


def pipe(value, *funcs):
    """Unary piping."""
    for func in funcs:
        value = func(value)
    return value


# ---
# Examples
# ---


def _series_creation():
    srs1 = pd.Series([1, 2, 3, 4])
    srs2 = pd.Series([1, 2, 3, 4, 5], index=["a", "b", "c", "d", "e"])
    srs3 = pd.Series({"a": 1, "b": 2, "c": 3})

    pretty_print_results(
        {
            "srs1": srs1,
            "srs2": srs2,
            "srs3": srs3,
        }
    )


def _series_attributes():
    srs = pd.Series([1, 2, 3, 4, 5], index=["a", "b", "c", "d", "e"])
    pretty_print_results(
        {
            "srs": srs,
            "srs.index": srs.index,
            "srs.dtype": srs.dtype,
            "srs.dtypes": srs.dtypes,
            "srs.empty": srs.empty,
            "srs.hasnans": srs.hasnans,
            "srs.is_monotonic_increasing": srs.is_monotonic_increasing,
            "srs.is_monotonic_decreasing": srs.is_monotonic_decreasing,
            "srs.is_unique": srs.is_unique,
            "srs.name": srs.name,
            "srs.nbytes": srs.nbytes,
            "srs.ndim": srs.ndim,
            "srs.shape": srs.shape,
            "srs.size": srs.size,
            # Informative methods
            "srs.describe()": srs.describe(),
            "srs.memory_usage()": srs.memory_usage(),
        }
    )


def _series_indexing():
    srs = pd.Series([1, 2, 3, 4, 5], index=["a", "b", "c", "d", "e"])

    pretty_print_results(
        {
            "srs": srs,
            "srs[0]": srs[0],
            "srs[0:3]": srs[0:3],
            'srs["a"]': srs["a"],
            'srs[["a", "b", "c"]]': srs[["a", "b", "c"]],
        }
    )


def _series_boolean_mask():
    srs = pd.Series([1, 2, 3, 4, 5], index=["a", "b", "c", "d", "e"])

    pretty_print_results(
        {
            "srs": srs,
            "srs[srs.eq(2)]": srs[srs.eq(2)],
            "srs[srs.ne( 2)]": srs[srs.ne(2)],
            "srs[~srs.isin([1, 2, 3])]": srs[~srs.isin([1, 2, 3])],
            "srs[(srs.gt(1)) & (srs.lt(4))]": srs[(srs.gt(1)) & (srs.lt(4))],
            "srs[(srs.lt(2)) | (srs.gt(4))]": srs[(srs.lt(2)) | (srs.gt(4))],
        }
    )


def _series_serde():
    srs = pd.Series([1, 2, 3, 4, 5], index=["a", "b", "c", "d", "e"])

    pretty_print_results(
        {
            "srs": srs,
            "srs.to_dict()": srs.to_dict(),
            "srs.to_csv()": srs.to_csv(),
            "srs.to_json()": srs.to_json(),
            "srs.to_list()": srs.to_list(),
        }
    )


def _series_string():
    names = ["Kakashi", "Iruka", "Yamato", "Itachi", "Hiruzen"]
    srs = pd.Series(names, name="names")

    def _encode(srs: pd.Series, encoding="utf-8") -> pd.Series:
        return srs.str.encode(encoding)

    def _decode(srs: pd.Series, encoding="utf-8") -> pd.Series:
        return srs.str.decode(encoding)

    # TODO: extract, find, get, join, normalize, pad, splice, split, zfill

    pretty_print_results(
        {
            "srs": srs,
            "srs.str.capitalize()": srs.str.capitalize(),
            "srs.str.casefold()": srs.str.casefold(),
            "srs.str.center(10)": srs.str.center(10),
            'srs.str.contains("a")': srs.str.contains("a"),
            'srs.str.count("a")': srs.str.count("a"),
            "_decode(_encode(srs))": _decode(_encode(srs)),
            'srs.str.endswith("i")': srs.str.endswith("i"),
            'srs.str.startswith("I")': srs.str.startswith("I"),
            "srs.str.isalnum()": srs.str.isalnum(),
            "srs.str.isalpha()": srs.str.isalpha(),
            "srs.str.isdecimal()": srs.str.isdecimal(),
            "srs.str.isdigit()": srs.str.isdigit(),
            "srs.str.isnumeric()": srs.str.isnumeric(),
            "srs.str.len()": srs.str.len(),
            "srs.str.lower()": srs.str.lower(),
            "srs.str.upper()": srs.str.upper(),
            "srs.str.repeat(2)": srs.str.repeat(2),
            'srs.str.replace("shi", " Sensei")': srs.str.replace("shi", " Sensei"),
            "srs.str.title()": srs.str.title(),
        }
    )


def _series_comparison():
    srs1 = pd.Series(range(1, 6))
    srs2 = pd.Series(list(reversed(range(1, 6))))

    pretty_print_results(
        {
            "srs1": srs1,
            "srs2": srs2,
            "srs1.gt(3)": srs1.gt(3),
            "srs1.gt(srs2)": srs1.gt(srs2),
            "srs1.ge(3)": srs1.ge(3),
            "srs1.ge(srs2)": srs1.ge(srs2),
            "srs1.lt(3)": srs1.lt(3),
            "srs1.lt(srs2)": srs1.lt(srs2),
            "srs1.le(3)": srs1.le(3),
            "srs1.le(srs2)": srs1.le(srs2),
            "srs1.eq(3)": srs1.eq(3),
            "srs1.eq(srs2)": srs1.eq(srs2),
            "srs1.ne(3)": srs1.ne(3),
            "srs1.ne(srs2)": srs1.ne(srs2),
            "srs1.between(2, 4)": srs1.between(2, 4),
            "srs1.isin([2, 3, 4])": srs1.isin([2, 3, 4]),
            "srs1.isin(srs2)": srs1.isin(srs2),
            "srs1.gt(srs2).any()": srs1.gt(srs2).any(),
            "srs1.gt(0).all()": srs1.gt(0).all(),
        }
    )


def _series_math():
    srs = pd.Series(randn(5))

    # math methods
    pretty_print_results(
        {
            "srs": srs,
            "srs.abs()": srs.abs(),
            "srs.clip(2, 4)": srs.clip(2, 4),
            "srs.round(2)": srs.round(2),
            "np.ceil(srs)": np.ceil(srs),
            "np.floor(srs)": np.floor(srs),
            "srs.add(1)": srs.add(1),
            "srs.add(srs)": srs.add(srs),
            "srs.mul(2)": srs.mul(2),
            "srs.mul(srs)": srs.mul(srs),
            "srs.div(2)": srs.div(2),
            "srs.div(srs)": srs.div(srs),
            "srs.pow(2)": srs.pow(2),
            "srs.pow(srs)": srs.pow(srs),
        }
    )


def _series_stats():
    srs = pd.Series(randn(5))

    # Also: quantile, rank, sample

    pretty_print_results(
        {
            "srs": srs,
            "srs.count()": srs.count(),  # number of (non-null, non-NaN) values
            "srs.sum()": srs.sum(),
            "srs.max()": srs.max(),
            "srs.min()": srs.min(),
            "srs.mean()": srs.mean(),
            "srs.mode()": srs.mode(),
            "srs.std()": srs.std(),
            "srs.var()": srs.var(),
            'srs.agg(["min", "max", "mean"])': srs.agg(["min", "max", "mean"]),
        }
    )


def _series_discrete_math():
    srs1 = pd.Series(range(1, 6))
    srs2 = pd.Series(list(reversed(range(1, 6))))
    joined = pd.concat([srs1, srs2]).reset_index(drop=True)

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
            "srs1": srs1,
            "srs2": srs2,
            "joined": joined,
            "intersection(srs1, [2, 3, 4])": intersection(srs1, [2, 3, 4]),
            "union(srs1, [0, 1, 2])": union(srs1, [0, 1, 2]),
            "diff(srs1, [2, 3, 4])": diff(srs1, [2, 3, 4]),
            "symmetric_diff(srs1, [0, 1, 2])": symmetric_diff(srs1, [0, 1, 2]),
            "srs1.isin([2, 3, 4])": srs1.isin([2, 3, 4]),
            "srs1.isin(srs2)": srs1.isin(srs2),
            "joined.duplicated()": joined.duplicated(),
            "joined.drop_duplicates()": joined.drop_duplicates(),
            "joined.unique()": joined.unique(),
            "joined.nunique()": joined.nunique(),
            "joined.value_counts()": joined.value_counts(),
        }
    )


def _series_missing_data():
    srs = pd.Series([0, None, 2, None, 4, None])

    pretty_print_results(
        {
            "srs": srs,
            "srs.bfill()": srs.bfill(),
            "srs.ffill()": srs.ffill(),
            "srs.fillna(0)": srs.fillna(0),
            "srs.dropna()": srs.dropna(),
            "srs.interpolate()": srs.interpolate(),
            "srs.isna()": srs.isna(),
            "srs.notna()": srs.notna(),
        }
    )


def _series_type_casting():
    srs = pd.Series(range(1, 6))

    pretty_print_results(
        {
            "srs": srs,
            "srs.astype('float64')": srs.astype("float64"),
        }
    )


def _series_updating():
    s1 = pd.Series(range(1, 6))
    s2 = pd.Series(list(reversed(range(1, 6))))

    # `where` vs `mask`:
    # where: where true, keep original
    # mask: where true, replace with fallback

    # TODO: map, applymap, apply
    pretty_print_results(
        {
            "s1": s1,
            "s2": s2,
            "s1.case_when([(s1.lt(3), s2)])": s1.case_when([(s1.lt(3), s2)]),
            "s1.mask(s1.lt(3), s2)": s1.mask(s1.lt(3), s2),
            "s1.where(s1.ge(3), s2)": s1.where(s1.ge(3), s2),
            "s2.sort_values()": s2.sort_values(),
        }
    )


def _index():
    ind = pd.Index(range(1, 6))

    # Has many series attributes/methods
    # Has set methods (difference, intersection, union, etc)

    pretty_print_results(
        {
            "ind.dtype": ind.dtype,
            "ind.empty": ind.empty,
            "ind.has_duplicates": ind.has_duplicates,
            "ind.hasnans": ind.hasnans,
            "ind.is_unique": ind.is_unique,
            "ind.ndim": ind.ndim,
            "ind.shape": ind.shape,
            "ind.size": ind.size,
            "ind.values": ind.values,
        }
    )


def _dataframe_creation():
    ninjas = _get_ninjas()

    df_from_records = pd.DataFrame(ninjas)

    ninjas_json = df_from_records.to_json(orient="records", index=False)
    df_from_json = pd.read_json(StringIO(ninjas_json))

    ninjas_csv = df_from_json.to_csv(index=False)
    df_from_csv = pd.read_csv(StringIO(ninjas_csv))

    ninjas_dict = df_from_csv.to_dict(orient="list")
    df_from_dict = pd.DataFrame(ninjas_dict)

    ninjas_records = df_from_dict.to_dict(orient="records")

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
    ninjas = _get_ninjas()
    df = pd.DataFrame(ninjas)

    pretty_print_results(
        {
            "df.columns": df.columns,
            "df.index": df.index,
            "df.shape": df.shape,
            "df.size": df.size,
            "df.dtypes": df.dtypes,
        }
    )


def _dataframe_indexing():
    df = pd.DataFrame(_get_ninjas())

    # Also: many indexers support slice (`df.iloc[0:2]`) and list (`df.iloc[[0,1,2]]`).
    pretty_print_results(
        {
            "df": df,
            'df["id"]': df["id"],
            'df[["id", "first_name"]]': df[["id", "first_name"]],
            "df.id": df.id,
            "df.head(2)": df.head(2),
            "df.tail(2)": df.tail(2),
            "df.loc[2]": df.loc[2],  # by row index
            "df.iloc[2]": df.iloc[2],  # by row position
            'df.at[2, "age"]': df.at[2, "age"],  # by row index, col
            "df.iat[2, 2]": df.iat[2, 2],  # by row position, col position
            'df.iloc[2].at["first_name"]': df.iloc[2].at["first_name"],
        }
    )


def _dataframe_boolean_mask():
    df = pd.DataFrame(_get_ninjas())
    df["village"] = "Leaf"

    pretty_print_results(
        {
            "df": df,
            "df[df.age.eq(25)]": df[df.age.eq(25)],
            "df[df.age.gt(21) & df.age.lt(27)]": df[df.age.gt(21) & df.age.lt(27)],
            "df[df.age.le(21) | df.age.ge(27)]": df[df.age.le(21) | df.age.ge(27)],
            'df[df.village.ne("Leaf")]': df[df.village.ne("Leaf")],
            'df[df.first_name.str.contains("k")]': df[df.first_name.str.contains("k")],
        }
    )


def _dataframe_updating():
    df = pd.DataFrame(_get_ninjas())

    df["village"] = "Leaf"
    df["alive"] = True
    passed_away = df["first_name"].isin(["Hiruzen", "Itachi", "Hashirama"])
    df["alive"] = df["alive"].mask(passed_away, False)
    df = df.rename(columns={"first_name": "firstName", "last_name": "lastName"})
    df = df.sort_values(by=["age"], ascending=[False])
    df = df.set_index("id")

    pretty_print_results({"df": df})


def _dataframe_iterating():
    df = pd.DataFrame(_get_ninjas())

    ninjas = [
        {"id": uid, "fn": fn, "ln": ln, "age": a}
        for (uid, fn, ln, a) in df[["id", "first_name", "last_name", "age"]].to_numpy()
    ]

    pretty_print_results({"ninjas": ninjas})


def _dataframe_merge():
    df1 = pd.DataFrame(_get_ninjas())
    df2 = pd.DataFrame(
        [
            {"first_name": "Kakashi", "village": "Leaf", "rank": "Jonin"},
            {"first_name": "Tenzo", "village": "Leaf", "rank": "Jonin"},
            {"first_name": "Iruka", "village": "Leaf", "rank": "Chunin"},
            {"first_name": "Itachi", "village": "Leaf", "rank": "Jonin"},
        ]
    )

    df = pd.merge(df1, df2, how="left", on="first_name")

    pretty_print_results({"df": df})


def _dataframe_concat():
    df = pd.DataFrame(_get_ninjas())
    idx = len(df) // 2
    df1 = df[:idx]
    df2 = df[idx:]

    df = pd.concat([df1, df2])
    pretty_print_results({"df": df})


def _dataframe_groupby():
    df = pd.DataFrame(
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

    # # DataFrameGroupBy
    # df_groups = df.groupby("date")
    # df_groups.groups
    # df_groups.get_group("2024-01-02")
    # # produce many rows: transform, head, tail
    # # produce one row: agg, all, any, count, first, last, max, mean, sample, std, var

    # Add new column with aggregation per group
    df["avg_amount_per_date"] = df.groupby("date")["amount"].transform("mean")

    # Iterate through groups
    for dash_date, group_df in df.groupby("date"):
        print(dash_date, len(group_df))

    # Aggregate
    min_per_date = df.sort_values(by="amount", ascending=True).groupby("date").first()
    max_per_date = df.sort_values(by="amount", ascending=False).groupby("date").first()
    count_per_date = df.groupby("date").count()
    agg_df = df.groupby("date").agg(["min", "max", "sum"])

    pretty_print_results(
        {
            "df": df,
            "min_per_date": min_per_date,
            "max_per_date": max_per_date,
            "count_per_date": count_per_date,
            "agg_df": agg_df,
        }
    )


# ---
# Run
# ---

main()
