import json
import os
from typing import List, Dict
import pyarrow as pa
import pyarrow.parquet as pq
import pandas as pd


# ---
# Constants
# ---

DATA_DIR = os.path.join('.', 'data')
DATA_INPUT_DIR = os.path.join(DATA_DIR, 'input')
DATA_OUTPUT_DIR = os.path.join(DATA_DIR, 'output')

# ---
# Main
# ---


def main():
    # Setup
    print_section_title('setup')
    setup()

    # Arrays
    print_section_title('basic array creation')
    basic_array_creation()

    # Tables
    print_section_title('basic table creation')
    basic_table_creation()

    print_section_title('basic table eject')
    basic_table_eject()

    print_section_title('basic table read/write parquet')
    basic_table_read_write_parquet()


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


# ---
# Setup
# ---

def setup():
    """Initia setup before running examples"""
    print('...')
    # Make sure dirs exist
    for directory in [DATA_DIR, DATA_INPUT_DIR, DATA_OUTPUT_DIR]:
        os.makedirs(directory, exist_ok=True)

# ---
# Array examples
# ---

# Docs: https://arrow.apache.org/docs/python/generated/pyarrow.Array.html


def basic_array_creation():
    """Create a basic pyarrow array"""
    arr: pa.Array = pa.array([1, 2, 3, 4, 5], type=pa.int8())
    print(arr)

    # TODO: from_pandas (Series),


def basic_array_ejection():
    print('TODO')
    # TODO: to_pandas, to_numpy, to_pylist, to_string


def basic_array_methods():
    print('TODO')
    # TODO
    # Select: filter, slice, sort, take, view
    # Transform: cast,
    # Nulls: drop_null, fill_null, is_nan, is_null, is_valid
    # Compare: diff, equals
    # Agg: sum

# ---
# Table examples
# ---

# Docs: https://arrow.apache.org/docs/python/generated/pyarrow.Table.html


def basic_table_creation():
    """Create a table in a variety of ways"""
    print('From pyarrow arrays')
    first_names = pa.array(['Kakashi', 'Itachi', 'Shisui'], type=pa.string())
    last_names = pa.array(['Hatake', 'Uchiha', 'Uchiha'], type=pa.string())
    tbl: pa.Table = pa.table([first_names, last_names], names=['first_name', 'last_name'])
    print(tbl)

    print('From List[dict]')
    tbl: pa.Table = pa.Table.from_pylist([
        {'first_name': 'Kakashi', 'last_name': 'Hatake', },
        {'first_name': 'Itachi', 'last_name': 'Uchiha', },
        {'first_name': 'Shisui', 'last_name': 'Uchiha', },
    ])
    print(tbl)

    print('From Dict[str, list]')
    tbl: pa.Table = pa.Table.from_pydict({
        'first_name': ['Kakashi', 'Itachi', 'Shisui'],
        'last_name': ['Hatake', 'Uchiha', 'Uchiha'],
    })
    print(tbl)

    # TODO: from_pandas


def basic_table_eject():
    """Eject data to another python type"""
    tbl: pa.Table = pa.Table.from_pylist([
        {'first_name': 'Kakashi', 'last_name': 'Hatake', },
        {'first_name': 'Itachi', 'last_name': 'Uchiha', },
        {'first_name': 'Shisui', 'last_name': 'Uchiha', },
    ])

    df: pd.DataFrame = tbl.to_pandas()  # NOTE: Requires pandas installation
    dict_: Dict[str, list] = tbl.to_pydict()
    list_: List[dict] = tbl.to_pylist()
    str_: str = tbl.to_string()

    print(json.dumps({
        'to_pandas > to_dict': df.to_dict(orient='records'),
        'to_pydict': dict_,
        'to_pylist': list_,
        'to_string': str_,
    }, indent=2))


def basic_table_read_write_parquet():
    """Write to parquet file and read back into pyarrow table"""
    numbers = pa.table([
        pa.array(range(1, 10), type=pa.int8()),
        pa.array(range(10, 100, 10), type=pa.int8()),
        pa.array(range(100, 1000, 100), type=pa.int16()),
    ], names=['a', 'b', 'c'])

    fn = 'numbers.parquet'
    fp = os.path.join(DATA_OUTPUT_DIR, fn)

    print('writing table')
    pq.write_table(numbers, fp)
    print('reading table')
    tbl = pq.read_table(fp)
    print(tbl)


def basic_table_details():
    print('TODO')
    tbl: pa.table = pa.Table.from_pylist([
        {'first_name': 'Kakashi', 'last_name': 'Hatake', },
        {'first_name': 'Itachi', 'last_name': 'Uchiha', },
        {'first_name': 'Shisui', 'last_name': 'Uchiha', },
    ])

    print({
        'column_names': tbl.column_names,
        'columns': tbl.columns,
        'nbytes': tbl.nbytes,
        'num_columns': tbl.num_columns,
        'num_rows': tbl.num_rows,
        'schema': tbl.schema,
        'shape': tbl.shape,
    })


def basic_table_methods():
    print('TODO')
    # TODO: append_column, cast, column, drop, drop_null, filter,
    # groupby, join, remove_column, rename_columns
    # select, set_column, slice, sort_by


main()
