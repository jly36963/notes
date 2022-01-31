import json
from typing import TypedDict, List, Union
from uuid import UUID
import polars as pl
# from pathlib import Path


class Ninja(TypedDict):
    id: UUID
    first_name: str
    last_name: str
    age: int


NINJAS_RECORDS: List[Ninja] = [
    {'id': 'fa6c4c93-fb64-4cd7-8b21-0e5e0f717fd6', 'first_name': 'Kakashi', 'last_name': 'Hatake', 'age': 27},
    {'id': '2c6c74c3-b9d6-4d49-a113-4f1a8164abe3', 'first_name': 'Tenzo', 'last_name': 'Yamato', 'age': 26},
    {'id': '2e9093d5-f466-40bb-be14-993276f0a497', 'first_name': 'Iruka', 'last_name': 'Umino', 'age': 25},
    {'id': '71547b9d-f28e-4511-b767-860bc37f148f', 'first_name': 'Itachi', 'last_name': 'Uchiha', 'age': 21},
]  # type: ignore (https://github.com/microsoft/pyright/issues/2592)


def basic_constructor():
    df = pl.DataFrame(NINJAS_RECORDS)
    print(df.head())


def basic_csv():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Write to csv file
    df.to_csv('data/ninjas.csv')
    # Read csv file to df
    df = pl.read_csv('data/ninjas.csv')
    print(df.head())


def basic_json():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Write to json file
    with open('data/ninjas.json', 'w') as fd:
        df_json = df.to_json(pretty=True, row_oriented=True, to_string=True)
        fd.write(df_json)
    # Read from json file
    df_json: Union[str, None] = None
    with open('data/ninjas.json', 'r', encoding='utf-8') as fd:
        df_json = fd.read()
    df_dicts: List[Ninja] = json.loads(df_json)
    df = pl.DataFrame(df_dicts)
    print(df.head())

    print('pl.read_json and df.to_json are not working (?)')
    # Read/Write json file
    # df.to_json('data/ninjas.json', pretty=True, row_oriented=True) # not working?
    # df = pl.read_json('data/ninjas.json')


def basic_df_concat():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Concat
    print(f"concat: {pl.concat([df, df])}")


def basic_df_attributes():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Get attributes
    print(f"shape: {df.shape}")
    print(f"height: {df.height}")
    print(f"width: {df.width}")
    print(f"columns: {df.columns}")
    print(f"dtypes: {df.dtypes}")
    print(f"schema: {df.schema}")


def basic_df_conversion():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Convert
    print(f"json: {df.to_json()}")
    print(f"dict: {df.to_dict()}")
    print(f"csv: {df.to_csv()}")
    # print(f"pandas: {df.to_pandas()}")  # requires pandas install # doesn't work?
    # print(f"numpy: {df.to_numpy()}")  # not implemented?


def basic_df_indexing():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Index
    print(f"row (as dataframe with single row): {df[2, :]}")  # df.iloc[2]
    print(f"multiple rows: {df[[1, 2], :]}")  # df.iloc[[1,2]]
    print(f"slice of rows: {df[1:3, :]}")  # df.iloc[1:3]
    print(f"rows using boolean mask: {df[[True, True, True, False]]}")
    print(f"rows using predicate: {df[df['age'] > 23]}")
    print(f"rows using predicate (faster): {df.filter((pl.col('age') > 23) & (pl.col('age') < 27))}")
    print(f"column as series: {df['first_name']}")
    print(f"value: {df[3, 'first_name']}")


def basic_column_assignment():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Add new columns
    df = df.with_columns([
        (pl.col('age') * 52).alias('age_to_weeks'),
        pl.col('first_name').str.to_uppercase().alias('fn'),
        pl.col('last_name').str.to_lowercase().alias('ln'),
    ])
    print(df.head())


def basic_column_mapping():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    df.replace('first_name', df['first_name'].str.to_uppercase())  # mutates in place
    print(df.head())


def basic_df_descriptive_methods():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Get details
    print(f"describe: {df.describe()}")
    print(f"is_duplicated: {df.is_duplicated()}")
    print(f"is_unique: {df.is_unique()}")
    print(f"null_count: {df.null_count()}")
    print(f"is_empty: {df.is_empty()}")


def basic_df_methods():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Use methods
    print(f"head: {df.head(2)}")
    print(f"limit: {df.limit(2)}")
    print(f"tail: {df.tail(2)}")
    print(f"slice: {df.slice(1, 1)}")
    print(f"drop: {df.drop('age')}")
    print(f"sort: {df.sort('age')}")
    print(f"sort (multiple): {df.sort(['age', 'first_name'])}")
    print(f"rename: {df.rename({'first_name': 'First Name', 'last_name': 'Last Name', 'age': 'Age'})}")
    print(f"sample: {df.sample(frac=.5)}")


def basic_column_aggregations():
    # Create dataframe
    df = pl.DataFrame(NINJAS_RECORDS)
    # Aggregations
    print(f"max: {df['age'].max()}")
    print(f"min: {df['age'].min()}")
    print(f"mean: {df['age'].mean()}")
    print(f"median: {df['age'].median()}")
    print(f"mode: {df['age'].mode()}")
    print(f"sum: {df['age'].sum()}")
    print(f"product: {df['age'].product()}")
    print(f"std: {df['age'].std()}")
    print(f"var: {df['age'].var()}")
    print(f"quantile (50%): {df['age'].quantile(.5)}")

    # useful math methods:
    # abs, sqrt, log, log10, exp
    # ceil, floor, clip, round
    # sin, cos, tan, arcsin, arccos, arctan


def basic_select():
    # TODO
    # https://pola-rs.github.io/polars-book/user-guide/dsl/intro.html
    # https://pola-rs.github.io/polars-book/user-guide/notebooks/introduction_polars.html
    # https://pola-rs.github.io/polars/py-polars/html/reference/api/polars.DataFrame.select.html
    pass


def basic_groupby():
    # TODO:
    # https://pola-rs.github.io/polars-book/user-guide/dsl/groupby.html
    pass
