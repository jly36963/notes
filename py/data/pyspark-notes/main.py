import findspark
findspark.init()  # noqa

import json
import os
from typing import List
from pyspark.sql import SparkSession, DataFrame, Column
from pyspark.sql.types import StructType  # StructField, StringType
import pyspark.sql.functions as pssf
import pandas as pd

# ---
# Constants
# ---

# Files
DATA_DIR = os.path.join('.', 'data')
DATA_INPUT_DIR = os.path.join(DATA_DIR, 'input')
DATA_OUTPUT_DIR = os.path.join(DATA_DIR, 'output')
NINJAS_CSV_FN = 'ninjas.csv'
NINJAS_CSV_INPUT_FP = os.path.join(DATA_INPUT_DIR, NINJAS_CSV_FN)
NINJAS_CSV_OUTPUT_FP = os.path.join(DATA_OUTPUT_DIR, NINJAS_CSV_FN)
NINJAS_JSON_FN = 'ninjas.json'
NINJAS_JSON_INPUT_FP = os.path.join(DATA_INPUT_DIR, NINJAS_JSON_FN)
NINJAS_JSON_OUTPUT_FP = os.path.join(DATA_OUTPUT_DIR, NINJAS_JSON_FN)
NINJAS_PARQUET_FN = 'ninjas.parquet'
NINJAS_PARQUET_INPUT_FP = os.path.join(DATA_INPUT_DIR, NINJAS_PARQUET_FN)
NINJAS_PARQUET_OUTPUT_FP = os.path.join(DATA_OUTPUT_DIR, NINJAS_PARQUET_FN)

# ---
# Main
# ---


def main():
    spark = get_spark_session()

    # Example DFs
    ninja_df = spark.read.csv(NINJAS_CSV_INPUT_FP, header=True)
    basic_df = spark.createDataFrame([
        {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5},
        {'a': 1, 'b': 3, 'c': 3, 'd': 4, 'e': 5},  # 'b' is off
        {'a': 1, 'b': 2, 'c': None, 'd': 4, 'e': 5},  # 'c' is null
        {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5},  # duplicate
        {'a': None, 'b': None, 'c': None, 'd': None, 'e': None},  # all null
    ])  # type:ignore

    print_section_title('setup')
    setup()

    print_section_title('basic create df')
    basic_create_df(spark)

    print_section_title('basic df read/write')
    basic_df_read_write(spark)

    print_section_title('basic df eject')
    basic_dataframe_eject(spark)

    print_section_title('basic df details')
    basic_df_details(ninja_df)

    print_section_title('basic df select')
    basic_df_select(ninja_df)

    print_section_title('basic df index')
    basic_df_index(ninja_df)

    print_section_title('basic df filter')
    basic_df_filter(ninja_df)

    print_section_title('basic df sort')
    basic_df_sort(ninja_df)

    print_section_title('basic df renamed')
    basic_df_renamed(ninja_df)

    print_section_title('basic df drop')
    basic_df_drop(ninja_df)

    print_section_title('basic df replace')
    basic_df_replace(basic_df)

    print_section_title('basic df null')
    basic_df_null(basic_df)

    print_section_title('basic df duplicates')
    basic_df_duplicates(basic_df)

    print_section_title('basic df with column')
    basic_df_with_column(basic_df)

# ---
# Utils
# ---


def get_spark_session() -> SparkSession:
    """Return a spark session"""
    return SparkSession.Builder()\
        .appName('MySparkApp')\
        .master('local[5]')\
        .getOrCreate()


def print_section_title(string: str) -> None:
    """Wrap with newlines, convert to uppercase, print"""
    print(f'\n{string.upper()}\n')


def df_to_records(df: DataFrame) -> List[dict]:
    """Convert a spark df to List[dict]"""
    return df.rdd.map(lambda row: row.asDict()).collect()


def df_col_to_list(df: DataFrame, colname: str) -> list:
    """pyspark Column to python list"""
    # TODO: use this
    return df.select(colname).toPandas()[colname].tolist()


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, DataFrame):
        return df_to_records(val)
    if isinstance(val, StructType):
        return val.json()
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then pretty print"""
    print(json.dumps({k: map_res(v) for k, v in results.items()}, indent=2))

# ---
# Examples
# ---

# TODO:
# Row.asDict()


def setup():
    """Initia setup before running examples"""
    print('...')
    # Make sure dirs exist
    for directory in [DATA_DIR, DATA_INPUT_DIR, DATA_OUTPUT_DIR]:
        os.makedirs(directory, exist_ok=True)


def basic_create_df(spark: SparkSession) -> None:
    """Create df from different data types"""
    results = {
        'From List[dict]': spark.createDataFrame([
            {'first_name': 'Kakashi', 'last_name': 'Hatake', },
            {'first_name': 'Itachi', 'last_name': 'Uchiha', },
            {'first_name': 'Shisui', 'last_name': 'Uchiha', },
        ]),  # type: ignore
        'From Dict[str, list]': spark.createDataFrame(pd.DataFrame({
            'first_name': ['Kakashi', 'Itachi', 'Shisui'],
            'last_name': ['Hatake', 'Uchiha', 'Uchiha'],
        })),
    }

    pretty_print_result_map(results)


def basic_df_read_write(spark: SparkSession) -> None:
    """Read/write df from/to file"""
    # Read
    csv_df = spark.read.csv(NINJAS_CSV_INPUT_FP, header=True)
    json_df = spark.read.json(NINJAS_JSON_INPUT_FP, multiLine=True)
    parquet_df = spark.read.parquet(NINJAS_PARQUET_INPUT_FP)

    results = {
        'CSV': csv_df,
        'JSON': json_df,
        'Parquet': parquet_df,
    }
    pretty_print_result_map(results)

    # Write
    # Writing parquet requires 'pyarrow' or 'fastparquet'
    csv_df.toPandas().to_csv(NINJAS_CSV_OUTPUT_FP)
    json_df.toPandas().to_json(NINJAS_JSON_OUTPUT_FP)
    parquet_df.toPandas().to_parquet(NINJAS_PARQUET_OUTPUT_FP)

    # # Write (writes directory instead of single file)
    # csv_df.write.csv(NINJAS_CSV_OUTPUT_FP)
    # json_df.write.json(NINJAS_JSON_OUTPUT_FP)
    # parquet_df.write.parquet(NINJAS_PARQUET_OUTPUT_FP)


def basic_dataframe_eject(spark: SparkSession) -> None:
    """Eject df into another python data type"""
    df: DataFrame = spark.createDataFrame([
        {'first_name': 'Kakashi', 'last_name': 'Hatake', },
        {'first_name': 'Itachi', 'last_name': 'Uchiha', },
        {'first_name': 'Shisui', 'last_name': 'Uchiha', },
    ])  # type: ignore

    results = {
        # NOTE: Requires pandas installation (to_pandas)
        'toPandas > to_dict (records)': df.toPandas().to_dict(orient='records'),  # List[dict]
        'toPandas > to_dict (list)': df.toPandas().to_dict(orient='list'),  # Dict[str, list]
        'map row asDict': df_to_records(df),  # List[dict]
        'toJSON > collect': df.toJSON().collect(),  # str
    }

    pretty_print_result_map(results)


def basic_df_details(ninja_df: DataFrame) -> None:
    """Get details about the df"""
    ninja_df.explain()

    # Describe: for all/specified columns, get count, mean, stddev, min, max
    # Summary: get all/specified of count, mean, stddev, min, [quartiles], max

    results = {
        'columns': ninja_df.columns,  # List[str]
        'count': ninja_df.count(),  # int
        'describe': ninja_df.describe(),  # DataFrame
        'dtypes': ninja_df.dtypes,  # List[Tuple[str, str]]
        'isEmpty': ninja_df.isEmpty(),  # bool
        'isLocal': ninja_df.isLocal(),  # bool
        'schema': ninja_df.schema,  # StructType
        'summary': ninja_df.summary('mean', 'stddev'),  # DataFrame
    }

    pretty_print_result_map(results)


def basic_df_select(ninja_df: DataFrame) -> None:
    """Select parts of the df"""
    # To use columns, reference it with 'str' or 'Column' type
    # Eg: 'col1', df['col1'], or df.col1

    results = {
        'select (single col)': ninja_df.select('id').toPandas()['id'].tolist(),
        'select (multiple cols)': ninja_df.select('first_name', 'last_name'),
    }

    pretty_print_result_map(results)


def basic_df_index(ninja_df: DataFrame) -> None:
    """Select parts of the df"""
    results = {
        'first': ninja_df.first(),  # Row | None
        'head': ninja_df.head(2),  # List[Row]
        'limit': ninja_df.limit(2),  # DataFrame
        'sample': ninja_df.sample(.2),  # DataFrame
        'tail': ninja_df.tail(2),  # List[Row]
        'take': ninja_df.take(2),  # List[Row]
    }

    pretty_print_result_map(results)


def basic_df_filter(ninja_df: DataFrame) -> None:
    """Filter df using filter/where"""
    ninja_df.show()

    # Column supports many operators
    # ==, !=, >, >=, <, <=
    # & | ^

    # Column methods:
    # eqNullSafe, isNotNull, isNull,
    # isin
    # between
    # contains, endswith, ilike, like, rlike, startswith
    # bitwiseAND, bitwiseOR, bitwiseXOR

    results = {
        'filter (age > gt)': ninja_df.filter(ninja_df.age >= 26),
        'filter (age > isin)': ninja_df.filter(ninja_df.age.isin([26, 27])),
        'filter (last_name > contains)': ninja_df.filter(ninja_df.last_name.contains('Uchiha')),
        'filter (multiple conditions)': ninja_df.filter(
            ninja_df.first_name.contains('a') & ninja_df.last_name.contains('a')
        )
    }

    pretty_print_result_map(results)


def basic_df_sort(ninja_df: DataFrame) -> None:
    """Sort a dataframe"""
    results = {
        'sort (asc)': ninja_df.sort(ninja_df.id.asc()),
        'sort (desc)': ninja_df.sort(ninja_df.id.desc()),
        'sort (multi)': ninja_df.sort(ninja_df.last_name.asc(), ninja_df.first_name.asc()),
    }

    pretty_print_result_map(results)


def basic_df_renamed(ninja_df: DataFrame) -> None:
    """Rename columns"""
    results = {
        'renamed': ninja_df.withColumnsRenamed({'last_name': 'lastName', 'first_name': 'firstName'})
    }
    pretty_print_result_map(results)


def basic_df_drop(ninja_df: DataFrame) -> None:
    """Drop a column"""
    results = {'drop': ninja_df.drop(ninja_df.age).drop(ninja_df.id)}
    pretty_print_result_map(results)


def basic_df_replace(basic_df: DataFrame) -> None:
    results = {
        'replace (all)': basic_df.replace(3, 0),
        'replace (subset)': basic_df.replace(3, 0, subset=['b']),
    }
    pretty_print_result_map(results)


def basic_df_null(basic_df: DataFrame) -> None:
    results = {
        'fillna': basic_df.fillna(3),
        'dropna (all)': basic_df.dropna(how='all'),
        'dropna (col)': basic_df.dropna(subset=['c']),
    }
    pretty_print_result_map(results)


def basic_df_duplicates(basic_df: DataFrame) -> None:
    results = {
        'distinct': basic_df.distinct(),
        'dropDuplicates': basic_df.dropDuplicates(),
        'dropDuplicates (subset)': basic_df.dropDuplicates(subset=['b', 'd']),
    }
    pretty_print_result_map(results)


def basic_df_with_column(basic_df: DataFrame) -> None:
    results = {
        'withColumn': basic_df.withColumn('f', basic_df.e + 1),
        'withColumns': basic_df.withColumns({
            'f': basic_df.e + 1,
            'g': basic_df.e + 2,
        })
    }
    pretty_print_result_map(results)

# TODO
# to, transform,
# toLocalIterator, forEach, map
# union, join
# groupBy

# ---
# Run
# ---


main()
