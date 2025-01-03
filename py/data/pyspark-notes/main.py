"""Pyspark notes."""

import findspark

findspark.init()

# ruff: noqa: E402
# pylint: disable=C0413,C0411

import json
import uuid
from pathlib import Path
from typing import Callable, Generator, TypedDict  # noqa: UP035

import pandas as pd
import pyspark.sql.functions as pssf
from pyspark import RDD
from pyspark.sql import Column, DataFrame, SparkSession
from pyspark.sql.types import StringType, StructField, StructType

# ---
# Constants
# ---

# Files
DATA_DIR = Path("data")
DATA_INPUT_DIR = DATA_DIR / "input"
DATA_OUTPUT_DIR = DATA_DIR / "output"
NINJAS_CSV_FN = "ninjas.csv"
NINJAS_CSV_INPUT_FP = DATA_INPUT_DIR / NINJAS_CSV_FN
NINJAS_CSV_OUTPUT_FP = DATA_OUTPUT_DIR / NINJAS_CSV_FN
NINJAS_JSON_FN = "ninjas.json"
NINJAS_JSON_INPUT_FP = DATA_INPUT_DIR / NINJAS_JSON_FN
NINJAS_JSON_OUTPUT_FP = DATA_OUTPUT_DIR / NINJAS_JSON_FN
NINJAS_PARQUET_FN = "ninjas.parquet"
NINJAS_PARQUET_INPUT_FP = DATA_INPUT_DIR / NINJAS_PARQUET_FN
NINJAS_PARQUET_OUTPUT_FP = DATA_OUTPUT_DIR / NINJAS_PARQUET_FN

# ---
# Main
# ---


def main():
    """Run pyspark examples."""
    spark = get_spark_session()

    # Example DFs
    ninja_df = spark.read.csv(str(NINJAS_CSV_INPUT_FP), header=True)
    basic_df = spark_df_from_records(
        spark,
        [
            {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5},
            {"a": 1, "b": 3, "c": 3, "d": 4, "e": 5},  # 'b' is off
            {"a": 1, "b": 2, "c": None, "d": 4, "e": 5},  # 'c' is null
            {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5},  # duplicate
            {"a": None, "b": None, "c": None, "d": None, "e": None},  # all null
        ],
    )

    print_section_title("setup")
    setup()

    print_section_title("basic create df")
    _basic_create_df(spark)

    print_section_title("basic df read/write")
    _basic_df_read_write(spark)

    print_section_title("basic df eject")
    _basic_dataframe_eject(spark)

    print_section_title("basic df details")
    _basic_df_details(ninja_df)

    print_section_title("basic df select columns")
    _basic_df_select_columns(ninja_df)

    print_section_title("basic df index")
    _basic_df_index(ninja_df)

    print_section_title("basic df filter")
    _basic_df_filter(ninja_df)

    print_section_title("basic df select")
    _basic_df_select(ninja_df)

    print_section_title("basic df sort")
    _basic_df_sort(ninja_df)

    print_section_title("basic df renamed")
    _basic_df_renamed(ninja_df)

    print_section_title("basic df drop")
    _basic_df_drop(ninja_df)

    print_section_title("basic df replace")
    _basic_df_replace(basic_df)

    print_section_title("basic df null")
    _basic_df_null(basic_df)

    print_section_title("basic df duplicates")
    _basic_df_duplicates(basic_df)

    print_section_title("basic df with column")
    _basic_df_with_column(basic_df)

    print_section_title("basic df to")
    _basic_df_to(basic_df)

    print_section_title("basic df transform")
    _basic_df_transform(basic_df)

    print_section_title("basic df iter")
    _basic_df_iter(ninja_df)

    print_section_title("basic df join")
    _basic_df_join(spark, ninja_df)

    print_section_title("basic df groupby")
    _basic_df_groupby(basic_df)

    print_section_title("basic df parallelize")
    _basic_spark_parallelize(spark)


# ---
# Utils
# ---


def spark_df_from_records(spark: SparkSession, records: list[dict]) -> DataFrame:
    """Create a spark dataframe from records."""
    return spark.createDataFrame(records)  # type: ignore


def get_spark_session() -> SparkSession:
    """Return a spark session."""
    return SparkSession.Builder().appName("MySparkApp").master("local[5]").getOrCreate()


def print_section_title(string: str) -> None:
    """Wrap with newlines, convert to uppercase, print."""
    print(f"\n{string.upper()}\n")


def df_to_records(df: DataFrame) -> list[dict]:
    """Convert a spark df to List[dict]."""
    return df.rdd.map(lambda row: row.asDict()).collect()


def df_col_to_list(df: DataFrame, colname: str) -> list:
    """Convert a pyspark Column to python list."""
    return df.select(colname).toPandas()[colname].tolist()


def map_res(val):
    """Map type to more print-friendly type."""
    if isinstance(val, DataFrame):
        return df_to_records(val)
    if isinstance(val, StructType):
        return val.simpleString()
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then pretty print."""
    print(json.dumps({k: map_res(v) for k, v in results.items()}, indent=2))


# ---
# Setup
# ---


def setup():
    """Initia setup before running examples."""
    print("..")
    # Make sure dirs exist
    for directory in [DATA_DIR, DATA_INPUT_DIR, DATA_OUTPUT_DIR]:
        Path.mkdir(directory, parents=True, exist_ok=True)


# ---
# Examples
# ---


def _basic_create_df(spark: SparkSession) -> None:
    """Create pyspark df from different data types."""
    results = {
        "From List[dict]": spark_df_from_records(
            spark,
            [
                {
                    "first_name": "Kakashi",
                    "last_name": "Hatake",
                },
                {
                    "first_name": "Itachi",
                    "last_name": "Uchiha",
                },
                {
                    "first_name": "Shisui",
                    "last_name": "Uchiha",
                },
            ],
        ),
        "From Dict[str, list]": spark.createDataFrame(
            pd.DataFrame(
                {
                    "first_name": ["Kakashi", "Itachi", "Shisui"],
                    "last_name": ["Hatake", "Uchiha", "Uchiha"],
                }
            )
        ),
    }

    pretty_print_result_map(results)


def _basic_df_read_write(spark: SparkSession) -> None:
    """Read/write df from/to file."""
    # Read
    csv_df = spark.read.csv(str(NINJAS_CSV_INPUT_FP), header=True)
    json_df = spark.read.json(str(NINJAS_JSON_INPUT_FP), multiLine=True)
    parquet_df = spark.read.parquet(str(NINJAS_PARQUET_INPUT_FP))

    results = {
        "CSV": csv_df,
        "JSON": json_df,
        "Parquet": parquet_df,
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


def _basic_dataframe_eject(spark: SparkSession) -> None:
    """Eject df into another python data type."""
    df: DataFrame = spark_df_from_records(
        spark,
        [
            {
                "first_name": "Kakashi",
                "last_name": "Hatake",
            },
            {
                "first_name": "Itachi",
                "last_name": "Uchiha",
            },
            {
                "first_name": "Shisui",
                "last_name": "Uchiha",
            },
        ],
    )  # type: ignore

    results = {
        # NOTE: Requires pandas installation (to_pandas)
        "toPandas > to_dict (records)": df.toPandas().to_dict(
            orient="records"
        ),  # List[dict]
        "toPandas > to_dict (list)": df.toPandas().to_dict(
            orient="list"
        ),  # Dict[str, list]
        "map row asDict": df_to_records(df),  # List[dict]
        "toJSON > collect": df.toJSON().collect(),  # str
    }

    pretty_print_result_map(results)


def _basic_df_details(ninja_df: DataFrame) -> None:
    """Get details about the df."""
    ninja_df.explain()

    # Describe: for all/specified columns, get count, mean, stddev, min, max
    # Summary: get all/specified of count, mean, stddev, min, [quartiles], max

    results = {
        "columns": ninja_df.columns,  # List[str]
        "count": ninja_df.count(),  # int
        "describe": ninja_df.describe(),  # DataFrame
        "dtypes": ninja_df.dtypes,  # List[Tuple[str, str]]
        "isEmpty": ninja_df.isEmpty(),  # bool
        "isLocal": ninja_df.isLocal(),  # bool
        "schema": ninja_df.schema,  # StructType
        "summary": ninja_df.summary("mean", "stddev"),  # DataFrame
    }

    pretty_print_result_map(results)


def _basic_df_select_columns(ninja_df: DataFrame) -> None:
    """Select parts of the df."""
    # To use columns, reference it with 'str' or 'Column' type
    # Eg: 'col1', df['col1'], or df.col1

    results = {
        "select (single col)": ninja_df.select("id").toPandas()["id"].tolist(),
        "select (multiple cols)": ninja_df.select("first_name", "last_name"),
    }

    pretty_print_result_map(results)


def _basic_df_index(ninja_df: DataFrame) -> None:
    """Select parts of the df."""
    results = {
        "first": ninja_df.first(),  # Row | None
        "head": ninja_df.head(2),  # List[Row]
        "limit": ninja_df.limit(2),  # DataFrame
        "sample": ninja_df.sample(0.2),  # DataFrame
        "tail": ninja_df.tail(2),  # List[Row]
        "take": ninja_df.take(2),  # List[Row]
    }

    pretty_print_result_map(results)


def _basic_df_filter(ninja_df: DataFrame) -> None:
    """Filter df using filter/where."""
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
        "filter (age > gt)": ninja_df.filter(ninja_df.age >= 26),  # noqa: PLR2004
        "filter (age > isin)": ninja_df.filter(ninja_df.age.isin([26, 27])),
        "filter (last_name > contains)": ninja_df.filter(
            ninja_df.last_name.contains("Uchiha")
        ),
        "filter (multiple conditions)": ninja_df.filter(
            ninja_df.first_name.contains("a") & ninja_df.last_name.contains("a")
        ),
    }

    pretty_print_result_map(results)


def _basic_df_select(df: DataFrame) -> None:
    """Select columns using function expressions."""
    senseis = ["Kakashi", "Iruka"]

    results = {
        "select": df.select(
            *df.columns,
            (df.age > 25).alias("older_than_25"),  # noqa: PLR2004
            (df.age + 25).alias("age_in_25_years"),
            df.last_name.contains("Uchiha").alias("is_uchiha"),
            pssf.when(df.first_name.isin(senseis), "Sensei")
            .otherwise(df.last_name)
            .alias("nickname"),
        ),
    }

    pretty_print_result_map(results)


def _basic_df_sort(ninja_df: DataFrame) -> None:
    """Sort a dataframe."""
    results = {
        "sort (asc)": ninja_df.sort(ninja_df.id.asc()),
        "sort (desc)": ninja_df.sort(ninja_df.id.desc()),
        "sort (multi)": ninja_df.sort(
            ninja_df.last_name.asc(), ninja_df.first_name.asc()
        ),
    }

    pretty_print_result_map(results)


def _basic_df_renamed(ninja_df: DataFrame) -> None:
    """Rename columns."""
    results = {
        "renamed": ninja_df.withColumnsRenamed(
            {"last_name": "lastName", "first_name": "firstName"}
        )
    }
    pretty_print_result_map(results)


def _basic_df_drop(ninja_df: DataFrame) -> None:
    """Drop a column."""
    results = {"drop": ninja_df.drop(ninja_df.age).drop(ninja_df.id)}
    pretty_print_result_map(results)


def _basic_df_replace(basic_df: DataFrame) -> None:
    results = {
        "replace (all)": basic_df.replace(3, 0),
        "replace (subset)": basic_df.replace(3, 0, subset=["b"]),
    }
    pretty_print_result_map(results)


def _basic_df_null(basic_df: DataFrame) -> None:
    results = {
        "fillna": basic_df.fillna(3),
        "dropna (all)": basic_df.dropna(how="all"),
        "dropna (col)": basic_df.dropna(subset=["c"]),
    }
    pretty_print_result_map(results)


def _basic_df_duplicates(basic_df: DataFrame) -> None:
    results = {
        "distinct": basic_df.distinct(),
        "dropDuplicates": basic_df.dropDuplicates(),
        "dropDuplicates (subset)": basic_df.dropDuplicates(subset=["b", "d"]),
    }
    pretty_print_result_map(results)


def _basic_df_with_column(basic_df: DataFrame) -> None:
    results = {
        "withColumn": basic_df.withColumn("f", basic_df.e + 1),
        "withColumns": basic_df.withColumns(
            {
                "f": basic_df.e + 1,
                "g": basic_df.e + 2,
            }
        ),
    }
    pretty_print_result_map(results)


def _basic_df_to(basic_df: DataFrame) -> None:
    """Reconcile rows to new schema."""
    string_df = basic_df.select("a", "b", "c").to(
        schema=StructType(
            [
                StructField("a", StringType(), True),
                StructField("b", StringType(), True),
                StructField("c", StringType(), True),
            ]
        )
    )
    results = {
        "schema (before)": basic_df.schema,
        "schema (after select/to)": string_df.schema,
        "to": string_df,
    }
    pretty_print_result_map(results)


def _basic_df_transform(basic_df: DataFrame) -> None:
    """Transform a df."""

    def double_col(col: Column) -> Column:
        """Expression to double all values in a column."""
        return col * 2

    def square_col(col: Column) -> Column:
        """Expression to square all values in a column."""
        return col**2

    def map_all_cols(df: DataFrame, func: Callable) -> DataFrame:
        """Apply a function expression over each column."""
        return df.select([func(df[c]).alias(c) for c in df.columns])

    results = {
        "transform (square)": basic_df.transform(
            lambda df: map_all_cols(df, square_col)
        ),
        "transform (double)": basic_df.transform(
            lambda df: map_all_cols(df, double_col)
        ),
    }
    pretty_print_result_map(results)


def _basic_df_iter(ninja_df: DataFrame) -> None:
    """Different ways of iterating over a dataframe."""

    def upper_if_string(val):
        """Uppercase string values and return others as is."""
        if not isinstance(val, str):
            return val
        return val.upper()

    def df_to_upper(df: pd.DataFrame) -> pd.DataFrame:
        """Map over all values in a dataframe, uppercasing if string."""
        return df.applymap(upper_if_string)  # type: ignore [reportCallIssue]

    def df_iterator(iterator, func: Callable) -> Generator:
        """Given an iterator of pandas df, apply function and return df."""
        df: pd.DataFrame
        for df in iterator:
            yield func(df)

    results = {
        "forEach": ninja_df.foreach(lambda r: print(r.first_name)),
        "mapInPandas": ninja_df.mapInPandas(
            lambda iterator: df_iterator(iterator, df_to_upper), ninja_df.schema
        ),
        "mapInArrow": "TODO",
        "toLocalIterator": [row.asDict() for row in ninja_df.toLocalIterator()],
    }
    pretty_print_result_map(results)


def _basic_df_join(spark: SparkSession, ninja_df: DataFrame) -> None:
    """Join dataframes (Many-to-many example: ninja -> ninja_village -> village)."""

    class Village(TypedDict):
        """TODO."""

        id: str
        name: str
        nation: str

    village_nations: dict[str, str] = {
        "leaf": "fire",
        "sand": "wind",
        "cloud": "lightning",
        "stone": "earth",
        "mist": "water",
    }

    villages: list[Village] = [
        {"id": str(uuid.uuid4()), "name": village, "nation": nation}
        for (village, nation) in village_nations.items()
    ]
    village_ids = [v["id"] for v in villages]
    leaf_id = village_ids[0]
    ninja_ids: list[str] = df_col_to_list(ninja_df, "id")

    class NinjaVillage(TypedDict):
        """TODO."""

        ninja_id: str
        village_id: str

    # In this example, they're all from the leaf village
    ninja_villages: list[NinjaVillage] = [
        {"ninja_id": ninja_id, "village_id": leaf_id} for ninja_id in ninja_ids
    ]

    village_df = spark.createDataFrame(villages)  # type: ignore
    ninja_village_df = spark.createDataFrame(ninja_villages)  # type: ignore

    joined_df = (
        ninja_df.join(
            ninja_village_df, on=ninja_df.id == ninja_village_df.ninja_id, how="inner"
        )
        .join(village_df, on=ninja_village_df.village_id == village_df.id, how="inner")
        .drop("id")
    )

    results = {"join": joined_df}

    pretty_print_result_map(results)


def _basic_df_groupby(basic_df: DataFrame) -> None:
    """Different ways of iterating over a dataframe."""
    # Grouped methods: agg, apply, avg, count, max, mean, min, sum
    results = {"groupby > count": basic_df.groupby("b").count().sort("b")}
    pretty_print_result_map(results)


def _basic_spark_parallelize(spark: SparkSession) -> None:
    """Parallel operations on RDD objects."""
    sc = spark.sparkContext
    # parallelize: List[T] -> RDD[T]
    num_rdd: RDD = sc.parallelize([1, 2, 3, 4, 5])
    print("foreach", num_rdd.foreach(print))
    results = {
        "collect": num_rdd.collect(),
        "count": num_rdd.count(),
        "filter": num_rdd.filter(lambda n: n > 3).collect(),  # noqa: PLR2004
        "first": num_rdd.first(),
        "fold": num_rdd.fold(0, lambda acc, cur: acc + cur),
        "map": num_rdd.map(lambda n: n * 2).collect(),
        "mapValues (with zip)": num_rdd.zip(num_rdd)
        .mapValues(lambda n: n * 2)
        .collect(),
        "max": num_rdd.max(),
        "mean": num_rdd.mean(),
        "min": num_rdd.min(),
        "sum": num_rdd.sum(),
        "stdev": num_rdd.stdev(),  # also sampleStdev, variance, sampleVariance
        "union": num_rdd.union(num_rdd.map(lambda n: n + 5)).collect(),
    }
    pretty_print_result_map(results)


# ---
# Run
# ---

main()
