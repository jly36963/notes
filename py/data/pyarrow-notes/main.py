import json
import os
from typing import List, Dict
import pyarrow as pa
import pyarrow.parquet as pq
import pandas as pd
import numpy as np


# ---
# Notes
# ---

# Pyarrow has no typing support
# Everything returns 'unknown' type
# Attributes of well-defined classes are 'unknown'
# :(

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

    print_section_title('basic array ejection')
    basic_array_ejection()

    print_section_title('basic array compute')
    basic_array_compute()

    print_section_title('basic array methods')
    basic_array_methods()

    # Tables
    print_section_title('basic table creation')
    basic_table_creation()

    print_section_title('basic table eject')
    basic_table_eject()

    print_section_title('basic table read/write parquet')
    basic_table_read_write_parquet()

    print_section_title('basic table details')
    basic_table_details()


# ---
# Utils
# ---

def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, (pa.Table, pa.Array, pa.ChunkedArray)):
        return val.to_pylist()
    if isinstance(val, pa.Scalar):
        return val.as_py()
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then print"""
    print(json.dumps({k: map_res(v) for k, v in results.items()}, indent=2))


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
    print('From normal creation')
    arr: pa.Array = pa.array([1, 2, 3, 4, 5], type=pa.int8())
    print(arr)

    print('From pandas series')
    arr: pa.Array = pa.Array.from_pandas(pd.Series([1, 2, 3, 4, 5]))
    print(arr)


def basic_array_ejection():
    """Eject data to another python type"""
    arr: pa.Array = pa.array([1, 2, 3, 4, 5], type=pa.int8())

    srs: pd.Series = arr.to_pandas()  # NOTE: Requires pandas installation
    nparr: np.ndarray = arr.to_numpy()
    list_: List[dict] = arr.to_pylist()
    str_: str = arr.to_string()

    results = {
        'to_pandas > to_list': srs.to_list(),
        'to_numpy > tolist': nparr.tolist(),
        'to_pylist': list_,
        'to_string': str_,
    }

    pretty_print_result_map(results)


def basic_array_compute():
    """Examples of pa.compute"""
    arr: pa.Array = pa.array([1, 2, 3, 4, 5], type=pa.int8())

    results: Dict[str, pa.Array | str] = {
        'arr': arr,

        # Arithmetic
        'abs': pa.compute.abs(arr),
        'add': pa.compute.add(arr, 2),
        'divide': pa.compute.divide(arr, 2),
        'negate': pa.compute.negate(arr),
        'power': pa.compute.power(arr, 2),
        'sqrt': pa.compute.sqrt(arr),
        'subtract': pa.compute.subtract(arr, 1),

        # Comparison
        'equal': pa.compute.equal(arr, 3),
        'greater': pa.compute.greater(arr, 0),
        'greater_equal': pa.compute.greater_equal(arr, 0),
        'less': pa.compute.less(arr, 10),
        'less_equal': pa.compute.less_equal(arr, 10),

        # Aggregations
        'all': pa.compute.all(pa.compute.greater(arr, 3)),
        'any': pa.compute.any(pa.compute.greater(arr, 3)),
        'count': pa.compute.count(arr),
        'max': pa.compute.max(arr),
        'mean': pa.compute.mean(arr),
        'min': pa.compute.min(arr),
        'mode': pa.compute.mode(arr),
        'product': pa.compute.product(arr),
        'stddev': pa.compute.stddev(arr),
        'sum': pa.compute.sum(arr),
        'variance': pa.compute.variance(arr),
    }

    pretty_print_result_map(results)

    # TODO

    # Rounding
    # ceil, floor, round, round_to_multiple

    # Logs
    # ln, log10, log2, logb

    # Logical
    # and_, and_not, invert, or_, xor

    # String predicate
    # ascii_is_alnum, ascii_is_alpha, ascii_is_alnum, ascii_is_lower
    # ascii_is_lower, ascii_is_space, ascii_is_title, ascii_is_upper
    # (utf8 equivalents of above)

    # String transforms
    # ascii_capitalize, ascii_lower, ascii_reverse, ascii_title, ascii_upper
    # (utf8 equivalents of above)
    # replace_substring, replace_substring_regex, ascii_

    # String padding
    # String trimming
    # String splitting
    # Containment Tests

    # Categorizations
    # is_finite, is_inf, is_nan, is_null, is_valid

    # Selecting / Multiplexing
    # case_wen, choose, coalesce, if_else

    # Temporal
    # ...

    # Associative transforms
    # unique, value_counts

    # Selections
    # drop_null, filter

    # Structural transforms
    # fill_null (forward/backward), list_flatten, list_slice, map_lookup


def basic_array_methods():
    arr: pa.Array = pa.array([1, 2, 3, 4, 5], type=pa.int8())

    results: dict = {
        'filter': arr.filter(pa.compute.greater(arr, 3)),
        'slice': arr.slice(0, 3),  # offset, length
        'sort': arr.sort(order='descending'),
        'unique': arr.unique(),
        'cast': arr.cast(target_type=pa.float64()),
        'is_valid': arr.is_valid(),  # Also: drop_null, fill_null, is_nan, is_null

    }

    pretty_print_result_map(results)

# ---
# Table examples
# ---

# Docs: https://arrow.apache.org/docs/python/generated/pyarrow.Table.html


def basic_table_creation():
    """Create a table in a variety of ways"""
    results = {
        'From pyarrow arrays':  pa.table([
            pa.array(['Kakashi', 'Itachi', 'Shisui'], type=pa.string()),
            pa.array(['Hatake', 'Uchiha', 'Uchiha'], type=pa.string())
        ], names=['first_name', 'last_name']),
        'From List[dict]': pa.Table.from_pylist([
            {'first_name': 'Kakashi', 'last_name': 'Hatake', },
            {'first_name': 'Itachi', 'last_name': 'Uchiha', },
            {'first_name': 'Shisui', 'last_name': 'Uchiha', },
        ]),
        'From Dict[str, list]': pa.Table.from_pydict({
            'first_name': ['Kakashi', 'Itachi', 'Shisui'],
            'last_name': ['Hatake', 'Uchiha', 'Uchiha'],
        }),
        'From pandas df': pa.Table.from_pandas(pd.DataFrame([
            {'first_name': 'Kakashi', 'last_name': 'Hatake', },
            {'first_name': 'Itachi', 'last_name': 'Uchiha', },
            {'first_name': 'Shisui', 'last_name': 'Uchiha', },
        ])),
    }
    pretty_print_result_map(results)


def basic_table_eject():
    """Eject data to another python type"""
    tbl: pa.Table = pa.Table.from_pylist([
        {'first_name': 'Kakashi', 'last_name': 'Hatake', },
        {'first_name': 'Itachi', 'last_name': 'Uchiha', },
        {'first_name': 'Shisui', 'last_name': 'Uchiha', },
    ])

    results = {
        # NOTE: Requires pandas installation (to_pandas)
        'to_pandas > to_dict': tbl.to_pandas().to_dict(orient='records'),
        'to_pydict': tbl.to_pydict(),  # Dict[str, list]
        'to_pylist': tbl.to_pylist(),  # List[dict]
        'to_string': tbl.to_string(),  # str
    }

    pretty_print_result_map(results)


def basic_table_read_write_parquet():
    """Write to parquet file and read back into pyarrow table"""
    numbers = pa.table([
        pa.array(range(1, 6), type=pa.int8()),
        pa.array(range(10, 60, 10), type=pa.int8()),
        pa.array(range(100, 600, 100), type=pa.int16()),
    ], names=['a', 'b', 'c'])

    fn = 'numbers.parquet'
    fp = os.path.join(DATA_OUTPUT_DIR, fn)

    pq.write_table(numbers, fp)
    tbl = pq.read_table(fp)
    print(tbl.to_pydict())


def basic_table_details():
    """Get basic details about the table"""
    tbl: pa.table = pa.Table.from_pylist([
        {'first_name': 'Kakashi', 'last_name': 'Hatake', },
        {'first_name': 'Itachi', 'last_name': 'Uchiha', },
        {'first_name': 'Shisui', 'last_name': 'Uchiha', },
    ])

    results = {
        'column_names': tbl.column_names,
        'columns > map > combine_chunks > to_pylist': [col.combine_chunks().to_pylist() for col in tbl.columns],
        'nbytes': tbl.nbytes,
        'num_columns': tbl.num_columns,
        'num_rows': tbl.num_rows,
        'schema': tbl.schema,
        'shape': tbl.shape,
    }

    print(results)


def basic_table_methods():
    print('TODO')
    # TODO: append_column, cast, column, drop, drop_null, filter,
    # groupby, join, remove_column, rename_columns
    # select, set_column, slice, sort_by


main()
