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
# Utils
# ---


def get_spark_session() -> SparkSession:
    return SparkSession.Builder()\
        .appName('MySparkApp')\
        .master('local[5]')\
        .getOrCreate()


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def df_to_records(df: DataFrame) -> List[dict]:
    return df.rdd.map(lambda row: row.asDict()).collect()


def df_col_to_list(df: DataFrame, colname: str) -> list:
    """pyspark Column to python list"""
    return df.select(colname).toPandas()[colname].tolist()


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, DataFrame):
        return df_to_records(val)
    if isinstance(val, StructType):
        return val.json()
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then print"""
    print(json.dumps({k: map_res(v) for k, v in results.items()}, indent=2))

# ---
# Main
# ---


def main():
    spark = get_spark_session()

    ninja_df = spark.read.csv(NINJAS_CSV_INPUT_FP, header=True)

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


def basic_df_details(df: DataFrame) -> None:
    """Get details about the df"""
    df.explain()

    # Describe: for all/specified columns, get count, mean, stddev, min, max
    # Summary: get all/specified of count, mean, stddev, min, [quartiles], max

    results = {
        'columns': df.columns,  # List[str]
        'count': df.count(),  # int
        'describe': df.describe(),  # DataFrame
        'dtypes': df.dtypes,  # List[Tuple[str, str]]
        'isEmpty': df.isEmpty(),  # bool
        'isLocal': df.isLocal(),  # bool
        'schema': df.schema,  # StructType
        'summary': df.summary('mean', 'stddev'),  # DataFrame
    }

    pretty_print_result_map(results)


def basic_df_select(df: DataFrame) -> None:
    """Select parts of the df"""
    # To use columns, reference it with 'str' or 'Column' type
    # Eg: 'col1', df['col1'], or df.col1

    results = {
        'select (single col)': df.select('id').toPandas()['id'].tolist(),
        'select (multiple cols)': df.select('first_name', 'last_name'),
    }

    pretty_print_result_map(results)


def basic_df_index(df: DataFrame) -> None:
    """Select parts of the df"""
    results = {
        'first': df.first(),  # Row | None
        'head': df.head(2),  # List[Row]
        'limit': df.limit(2),  # DataFrame
        'sample': df.sample(.2),  # DataFrame
        'tail': df.tail(2),  # List[Row]
        'take': df.take(2),  # List[Row]
    }

    pretty_print_result_map(results)


def basic_df_filter(df: DataFrame) -> None:
    """Filter df using filter/where"""
    df.show()

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
        'filter (age > gt)': df.filter(df.age >= 26),
        'filter (age > isin)': df.filter(df.age.isin([26, 27])),
        'filter (last_name > contains)': df.filter(df.last_name.contains('Uchiha')),
        'filter (multiple conditions)': df.filter(df.first_name.contains('a') & df.last_name.contains('a'))
    }

    pretty_print_result_map(results)

# TODO
# sort
# withColumnsRenamed
# fill, fillna, na
# replace
# drop
# distinct, dropDuplicates
# to, transform,
# toLocalIterator, forEach
# withColumn(s)
# union, join
# groupBy

# ---
# Run
# ---


main()
