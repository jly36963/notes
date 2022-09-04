from io import StringIO
import json
import os
from typing import TypedDict, List
import polars as pl
from pydash import chunk

dev = os.getenv('PYTHON_ENV') != 'production'

# ---
# About
# ---

# polars user guide
# https://pola-rs.github.io/polars-book/user-guide/introduction.html

# py-polars
# https://pola-rs.github.io/polars/py-polars/html/reference/

# ---
# Examples (Series)
# ---


def basic_series():
    # Attributes
    s1 = pl.Series("s1", range(1, 6))
    print("s1:", s1.to_list())
    print("name:", s1.name)
    print("dtype:", str(s1.dtype.string_repr()))
    print("shape[0]:", s1.shape[0])

    # Agg
    s2 = pl.Series("s2", range(1, 6)).cast(pl.Float64)
    print("s2:", s2.to_list())
    print("max:", s2.max())
    print("min:", s2.min())
    print("mean:", s2.mean())
    print("median:", s2.median())
    print("mode(extend 3s):", s2.cast(pl.Int32).extend_constant(3, 2).mode().to_list())
    print("sum:", s2.sum())
    print("product:", s2.product())
    print("std:", s2.std())
    print("var:", s2.var())
    print("quantile(.5):", s2.quantile(.5))

    # Manipulation: cast, append, reverse, sort, set, apply
    s3 = pl.Series("s3", [3, 4, 5, 1, 2])
    print("cast:", s3.cast(pl.Float64).to_list())
    print("sort:", s3.sort().to_list())
    print("reverse:", s3.reverse().to_list())
    print("apply:", s3.apply(lambda x: x + 1).to_list())

    # Round
    s4 = pl.Series("s4", range(1, 10)).cast(pl.Float64).apply(lambda x: round(x * 1.1, 1))
    print("s4:", s4.to_list())
    print("ceil:", s4.ceil().to_list())
    print("floor:", s4.floor().to_list())
    print("round:", s4.round(0).to_list())
    print("clip:", s4.clip(4, 6).to_list())

    # Selection:
    s5 = pl.Series("s5", [1, 2, 3] * 2)
    print("s5:", s5.to_list())
    print("filter:", s5.filter(s5 > 1).to_list())
    print("sample:", s5.sample(frac=.5, seed=1).to_list())
    print("shuffle:", s5.shuffle(seed=1).to_list())
    print("slice:", s5.slice(4).to_list())
    print("head:", s5.head().to_list())
    print("tail:", s5.tail().to_list())
    print("top_k:", s5.top_k(3).to_list())
    print("unique:", s5.unique().to_list())

    # Object namespaces: arr, cat, dt, str
    # Conversion: to_arrow, to_frame, to_list, to_numpy, to_pandas
    # Missing: drop_nans, drop_nulls, fill_nan, fill_null, interpolate

    # Strings
    # Regex: contains, ends_with, starts_with
    # Manipulation: replace, strip, to_lowercase, to_uppercase

# ---
# Examples (DataFrame)
# ---


def basic_df_creation():
    # Columns: Dict[str, Any]
    data = {
        'a': [1, 6, 11, 16, 21],
        'b': [2, 7, 12, 17, 22],
        'c': [3, 8, 13, 18, 23],
        'd': [4, 9, 14, 19, 24],
        'e': [5, 10, 15, 20, 25],
    }
    df = pl.DataFrame(data)
    print('df from Dict[str, Any]')
    print(df)

    # Multi-dimensional array: List[List[Any]]
    data = chunk(range(1, 26), 5)
    df = pl.DataFrame(data, columns=['a', 'b', 'c', 'd', 'e'], orient="row")
    print('df from List[List[Any]]')
    print(df)

    # Records: List[dict]
    data = [
        {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5},
        {'a': 6, 'b': 7, 'c': 8, 'd': 9, 'e': 10},
        {'a': 11, 'b': 12, 'c': 13, 'd': 14, 'e': 15},
        {'a': 16, 'b': 17, 'c': 18, 'd': 19, 'e': 20},
        {'a': 21, 'b': 22, 'c': 23, 'd': 24, 'e': 25},
    ]
    df = pl.DataFrame(data)
    print('df from List[dict]')
    print(df)


def basic_df_details():
    df = pl.read_csv(os.path.join("data", "iris.csv"))

    print("columns: ", df.columns)
    print("dtypes: ", df.dtypes)
    print("height: ", df.height)
    print("shape: ", df.shape)
    print("width: ", df.width)
    print("schema: ", df.schema)
    print("describe: ", df.describe())
    print("is_empty: ", df.is_empty())
    print("estimated_size('kb'): ", round(df.estimated_size("kb"), 2))


def basic_df_export():
    data = chunk(range(1, 26), 5)
    df = pl.DataFrame(data, columns=['a', 'b', 'c', 'd', 'e'], orient="row")

    # A path can be passed as an argument if writing to file

    # CSV
    csv = df.write_csv()
    assert isinstance(csv, str)
    print(csv)

    df = pl.read_csv(StringIO(csv))
    print(df.head())

    # JSON
    df_json = df.write_json(row_oriented=True)
    assert isinstance(df_json, str)
    print(df_json)

    df = pl.DataFrame(json.loads(df_json))
    print(df.head())

    # Array<object>
    records = df.to_dicts()
    print(records)

    df = pl.DataFrame(records)
    print(df.head())


def basic_df_selection():
    # indexing
    # https://pola-rs.github.io/polars-book/user-guide/howcani/selecting_data/selecting_data_indexing.html

    df = pl.read_csv('./data/iris.csv')

    print("row:", df.row(0))  # Tuple
    print('row (obj):', dict(zip(df.columns, df.row(0))))  # Dict
    print('slice:', df.slice(1, 2))  # Df
    print('column:', df.get_column('species').head())  # Series # Also `df['species']`
    print('columns:', df.select(['sepal_width', 'sepal_length']).head())  # Df
    print('cell:', df[0, 'species'])  # Any
    print("head:", df.head(5))  # Df
    print("tail:", df.tail(5))  # Df

    # Mask
    mask = df['sepal_length'] > 5.0  # Series
    print('boolean mask result:', df.filter(mask))  # Df

    # Using expressions
    print('filtered:', df.filter(pl.col('species') == 'Versicolor').head())  # Df
    print('filtered (str):', df.filter(pl.col('species').str.contains("Setosa")).head())  # Df
    print('mapped:', df.select([
        pl.all().exclude('species'),
        pl.col('species').str.to_uppercase()
    ]))

    # TODO: select(more advanced)


def basic_df_math():
    data = chunk(range(1, 26), 5)
    df = pl.DataFrame(data, columns=['a', 'b', 'c', 'd', 'e'], orient="row")

    print('add 1')
    print(df.select(pl.all().apply(lambda x: x + 1)))
    print('sub 1')
    print(df.select(pl.all().apply(lambda x: x - 1)))
    print('mul 2')
    print(df.select(pl.all().apply(lambda x: x * 2)))
    print('div 2')
    print(df.select(pl.all().apply(lambda x: x / 2)))


def basic_df_agg():
    df = pl.read_csv(os.path.join('data', 'iris.csv'))

    print("max: ", df.max())
    print("min: ", df.min())
    print("mean: ", df.mean())
    print("median: ", df.median())
    print("sum: ", df.sum())
    print("std: ", df.std())
    print("var: ", df.var())
    print("quantile (50%): ", df.quantile(.5))


def basic_df_mutation():
    data = chunk(range(1, 26), 5)
    df = pl.DataFrame(data, columns=['a', 'b', 'c', 'd', 'e'], orient="row")

    print("drop: ", df.drop('e'))
    print("rename: ", df.rename({"a": "A", "b": "B", "c": "C", "d": "D", "e": "E"}))
    print("sort:", df.sort('a'))
    print("sort (multiple): ", df.sort(['a', 'b']))
    print("sample: ", df.sample(frac=.5))


def basic_df_mutation2():
    data = chunk(range(1, 26), 5)
    df = pl.DataFrame(data, columns=['a', 'b', 'c', 'd', 'e'], orient="row")

    # In-place mutations
    df.replace('e', df['e'] * 10)

    print(df)


def basic_df_combine():
    data = chunk(range(1, 26), 5)
    df = pl.DataFrame(data, columns=['a', 'b', 'c', 'd', 'e'], orient="row")

    print(f"concat: {pl.concat([df, df])}")
    print(f'join: ', df.join(df, how='inner', on='a', suffix='_r'))  # left_on, right_on
    print(f"hstack: {df.hstack(df.rename({'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E'}))}")
    print(f"vstack: {df.vstack(df.clone())}")


def basic_df_add_columns():
    class Ninja(TypedDict):
        id: str
        first_name: str
        last_name: str
        age: int

    # Records
    ninja_records: List[Ninja] = [
        {'id': 'fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6', 'first_name': 'Kakashi', 'last_name': 'Hatake', 'age': 27},
        {'id': '2c6c74c3-b9d6-4d49-a113-4f1a8164abe3', 'first_name': 'Tenzo', 'last_name': 'Yamato', 'age': 26},
        {'id': '2e9093d5-f466-40bb-be14-993276f0a497', 'first_name': 'Iruka', 'last_name': 'Umino', 'age': 25},
        {'id': '71547b9d-f28e-4511-b767-860bc37f148f', 'first_name': 'Itachi', 'last_name': 'Uchiha', 'age': 21},
    ]
    # Columns/dtypes specified (optional)
    columns = [('id', pl.Utf8), ('first_name', pl.Utf8), ('last_name', pl.Utf8), ('age', pl.UInt8)]
    df = pl.DataFrame(ninja_records, columns=columns)

    # Replace/add columns (replace if col/alias match existing)
    # alias, prefix, suffix, ...
    df = df.with_columns([
        pl.col('age').apply(lambda x: x + 1),
        pl.col('first_name').str.to_uppercase().alias('fn'),
        pl.col('last_name').str.to_lowercase().alias('ln'),
    ])
    print(df.head())


def basic_df_mask():
    df = pl.read_csv(os.path.join('data', 'iris.csv'))
    df = df.sample(10)

    print('species is setosa', (df['species'] == 'Setosa').to_list())
    print('sepal_length > 5', (df['sepal_length'] > 5).to_list())
    print('is_duplicated', df.is_duplicated().to_list())
    print('is_unique', df.is_unique().to_list())


def basic_df_null():
    # TODO: fill_null, null_count, drop_null
    print("TODO")


def basic_df_grouping():
    df = pl.read_csv(os.path.join('data', 'iris.csv'))

    # Can be grouped by List[str]
    grouped = df.groupby('species')

    # Agg
    print('groupby species max:', grouped.max())
    print('groupby species mean:', grouped.mean())

    # Iterate
    for group_df in grouped:  # type: ignore
        print("species:", group_df[0, 'species'])
        print("count:", group_df.height)


def basic_df_partition():
    df = pl.read_csv(os.path.join('data', 'iris.csv'))

    # Can be partitioned by List[str]
    groups = df.partition_by('species', maintain_order=True)

    for group_df in groups:  # type: ignore
        print("species:", group_df[0, 'species'])
        print("count:", group_df.height)


def basic_df_column_aggregation():
    df = pl.read_csv(os.path.join('data', 'iris.csv'))
    df = df.sample(frac=.25)

    print(f"max: {df['sepal_length'].max()}")
    print(f"min: {df['sepal_length'].min()}")
    print(f"mean: {round(df['sepal_length'].mean(), 2)}")
    print(f"median: {df['sepal_length'].median()}")
    print(f"mode: {df['species'].mode().to_list()}")  # String and int columns only?
    print(f"sum: {round(df['sepal_length'].sum(), 2)}")
    print(f"product: {'{:.2e}'.format(df['sepal_length'].product())}")
    print(f"std: {round(df['sepal_length'].std(), 2)}")  # type: ignore
    print(f"var: {round(df['sepal_length'].var(), 2)}")  # type: ignore
    print(f"quantile (50%): {df['sepal_length'].quantile(.5)}")

    # useful math methods:
    # abs, sqrt, log, log10, exp
    # ceil, floor, clip, round
    # sin, cos, tan, arcsin, arccos, arctan


def basic_df_expressions():
    print("TODO")
    # Context
    # https://pola-rs.github.io/polars-book/user-guide/dsl/contexts.html
    # Window functions
    # https://pola-rs.github.io/polars-book/user-guide/dsl/expressions.html#window-expressions
    # https://pola-rs.github.io/polars-book/user-guide/dsl/window_functions.html
    # Expression API
    # https://pola-rs.github.io/polars-book/user-guide/dsl/api.html


def print_section_title(s: str):
    print(f"\n{s.upper()}\n")


def main():
    print_section_title('Basic series')
    basic_series()
    print_section_title('Basic df creation')
    basic_df_creation()
    print_section_title('Basic df details')
    basic_df_details()
    print_section_title('Basic df export')
    basic_df_export()
    print_section_title('Basic df selection')
    basic_df_selection()
    print_section_title('Basic df math')
    basic_df_math()
    print_section_title('Basic df agg')
    basic_df_agg()
    print_section_title('Basic df mutation')
    basic_df_mutation()
    print_section_title('Basic df mutation (in-place)')
    basic_df_mutation2()
    print_section_title('Basic df combine')
    basic_df_combine()
    print_section_title('Basic df add columns')
    basic_df_add_columns()
    print_section_title('Basic df mask')
    basic_df_mask()
    print_section_title('Basic df null')
    basic_df_null()
    print_section_title('Basic df grouping')
    basic_df_grouping()
    print_section_title('Basic df partition')
    basic_df_partition()
    print_section_title('Basic df column aggregation')
    basic_df_column_aggregation()
    print_section_title('Basic df expressions')
    basic_df_expressions()


if __name__ == "__main__":
    main()
