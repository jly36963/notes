//> using scala 3.7.4
//> using dep "com.lihaoyi::os-lib:0.11.6"
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"
//> using dep "org.apache.spark:spark-sql_2.13:4.1.1"
//> using dep "org.apache.spark:spark-core_2.13:4.1.1"

import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import io.circe.syntax.*
import org.apache.log4j.Level
import org.apache.log4j.Logger
import org.apache.spark.sql.Column
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.Encoder
import org.apache.spark.sql.Encoders
import org.apache.spark.sql.Row
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions.col
import org.apache.spark.sql.functions.when
import org.apache.spark.sql.types.*

import java.io.ByteArrayOutputStream
import java.io.PrintStream
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import scala.collection.JavaConverters.asScalaIteratorConverter
import scala.io.Source
import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.Using
import scala.util.chaining.scalaUtilChainingOps

// Spark doesn't support Scala 3
// Implicits won't work
// ie: `import spark.implicits._` and `data.toDF()`

// ---
// Main
// ---

@main
def runExamples(): Unit = {
  setup()
  val spark = getSparkSession()
  val ninjaDf = getNinjaDf(spark)
  val basicDf = getBasicDf(spark)

  val examples: List[(String, () => Unit)] = List(
    ("df-from-list-of-tuples", () => dfFromListOfTuples(spark)),
    ("df-from-list-of-classes", () => dfFromListOfClasses(spark)),
    ("df-io-csv", () => dfIoCsv(spark)),
    ("df-io-json", () => dfIoJson(spark)),
    ("df-details", () => dfDetails(ninjaDf)),
    ("df-select-columns", () => dfSelectColumns(ninjaDf)),
    ("df-select-rows", () => dfSelectRows(ninjaDf)),
    ("df-filter", () => dfFilter(ninjaDf)),
    ("df-select-expressions", () => dfSelectExpressions(ninjaDf)),
    ("df-with-column", () => dfWithColumn(ninjaDf)),
    ("df-sort", () => dfSort(ninjaDf)),
    ("df-rename-columns", () => dfRenameColumns(ninjaDf)),
    ("df-drop", () => dfDrop(ninjaDf)),
    ("df-handle-null", () => dfHandleNull(basicDf)),
    ("df-handle-duplicates", () => dfHandleDuplicates(basicDf)),
    ("df-cast-column", () => dfCastColumn(basicDf)),
    ("df-transform", () => dfTransform(basicDf)),
    ("df-join", () => dfJoin(ninjaDf)),
    ("df-groupby", () => dfGroupby(ninjaDf)),
    ("df-parallelize", () => dfParallelize(spark)),
  )
  examples.foreach((s) => {
    val (title, fn) = s
    println(s"\n${title.toUpperCase()}\n")
    fn()
  })
}

// ---
// Utils
// ---

def dfToCsv(df: DataFrame): String = {
  val header = df.columns.mkString(",")
  val rows = df.collect().map(r => r.toSeq.map(_.toString).mkString(",")).mkString("\n")
  val csvString = s"$header\n$rows"
  csvString
}

def dfToJsonDense(df: DataFrame): String = {
  val jsonStrings: Array[String] = df.toJSON.collect()
  jsonStrings.mkString("[", ",", "]")
}

def dfToJsonPretty(df: DataFrame): String = {
  val jsonObjs: Seq[Json] = df.toJSON.collect().flatMap(s => parse(s).toOption)
  Json.fromValues(jsonObjs).spaces2
}

def dfToJson(df: DataFrame, pretty: Boolean = true): String = {
  if (pretty) dfToJsonPretty(df) else dfToJsonDense(df)
}

/** Convert DataFrame to String */
def show(df: DataFrame): String = {
  val stream = new ByteArrayOutputStream()
  val ps = new PrintStream(stream)
  Console.withOut(ps) {
    df.show()
  }
  stream.toString("UTF-8")
}

/** Set up spark locally, using all cores */
def getSparkSession(): SparkSession = {
  val spark = SparkSession
    .builder()
    .appName("SparkExample")
    .master("local[*]")
    .getOrCreate()
  spark
}

def readCsv(spark: SparkSession, path: Path): DataFrame = {
  spark.read
    .format("csv")
    .option("header", "true")
    .option("inferSchema", "true")
    .load(path.toString())
}

def writeCsv(df: DataFrame, path: Path): Unit = {
  val content = dfToCsv(df)
  Files.write(path, content.getBytes(StandardCharsets.UTF_8))
}

def readJson(spark: SparkSession, path: Path): DataFrame = {
  spark.read.option("multiLine", true).json(path.toString())
}

def writeJson(df: DataFrame, path: Path): Unit = {
  val content = dfToJson(df)
  Files.write(path, content.getBytes(StandardCharsets.UTF_8))
}

def getBasicDf(spark: SparkSession): DataFrame = {
  case class Record(
      a: Option[Double],
      b: Option[Double],
      c: Option[Double],
      d: Option[Double],
      e: Option[Double],
  )
  val values = List(
    Record(Some(1), Some(2), Some(3), Some(4), Some(5)), // normal
    Record(Some(1), Some(3), Some(3), Some(4), Some(5)), // b is different
    Record(Some(1), Some(3), None, Some(4), Some(5)), // c is None
    Record(Some(1), Some(2), Some(3), Some(4), Some(5)), // duplicate
    Record(None, None, None, None, None), // all null
  )
  val schema = StructType(
    Seq(
      StructField("a", DoubleType, nullable = true),
      StructField("b", DoubleType, nullable = true),
      StructField("c", DoubleType, nullable = true),
      StructField("d", DoubleType, nullable = true),
      StructField("e", DoubleType, nullable = true),
    )
  )
  val rows = values.map({ case Record(a, b, c, d, e) =>
    Row(a.orNull, b.orNull, c.orNull, d.orNull, e.orNull)
  })
  val df = spark.createDataFrame(spark.sparkContext.parallelize(rows), schema)
  df
}

def getNinjaDf(spark: SparkSession): DataFrame = {
  val inputFp = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(spark, inputFp)
  df
}

// ---
// Examples
// ---

/** Silence loggers and ensure directories exist */
def setup(): Unit = {
  // Silence loggers
  System.setProperty("log4j.configuration", "file:./log4j.properties")
  Logger.getLogger("org").setLevel(Level.ERROR)
  Logger.getLogger("akka").setLevel(Level.ERROR)
  Logger.getLogger("org.apache.spark").setLevel(Level.ERROR)

  // Ensure directories exist
  val inputDir = Paths.get("./data/input/")
  Files.createDirectories(inputDir)
  val outputDir = Paths.get("./data/output/")
  Files.createDirectories(outputDir)
}

/** Create a dataframe from a list of tuples */
def dfFromListOfTuples(spark: SparkSession): Unit = {
  val values = Seq(
    ("Kakashi", "Hatake"),
    ("Itachi", "Uchiha"),
    ("Shisui", "Uchiha")
  )
  val schema = StructType(
    Seq(
      StructField("firstName", StringType, nullable = false),
      StructField("lastName", StringType, nullable = false)
    )
  )
  val rows = values.map({ case (f, l) => Row(f, l) })
  val df = spark.createDataFrame(spark.sparkContext.parallelize(rows), schema)
  given Encoder[(String, String)] =
    Encoders.tuple(Encoders.STRING, Encoders.STRING)
  val output = df.as[(String, String)].collect().toList

  val results = List(
    s"values: ${values}",
    s"show(df):\n${show(df)}",
    s"dfToCsv(df):\n${dfToCsv(df)}",
    s"dfToJson(df):\n${dfToJson(df)}",
    s"output: ${output}",
  )
  results.foreach(println)
}

/** Create a dataframe from a list of case classes */
def dfFromListOfClasses(spark: SparkSession): Unit = {
  case class Ninja(firstName: String, lastName: String)
  val values = List(
    Ninja("Kakashi", "Hatake"),
    Ninja("Itachi", "Uchiha"),
    Ninja("Shisui", "Uchiha"),
  )
  val schema = StructType(
    Seq(
      StructField("firstName", StringType, nullable = false),
      StructField("lastName", StringType, nullable = false)
    )
  )
  val rows = values.map({ case Ninja(f, l) => Row(f, l) })
  val df = spark.createDataFrame(spark.sparkContext.parallelize(rows), schema)
  val output = df.collect().map({ case Row(f: String, l: String) => Ninja(f, l) }).toList

  val results = List(
    s"values: ${values}",
    s"show(df):\n${show(df)}",
    s"output: ${output}",
  )
  results.foreach(println)
}

/** Read a CSV file to df and then write to file. */
def dfIoCsv(spark: SparkSession): Unit = {
  val inputFp = Paths.get("./data/input/ninjas.csv")
  val outputFp = Paths.get("./data/output/ninjas.csv")
  val df = readCsv(spark, inputFp)
  writeCsv(df, outputFp)

  // // Writes directory
  // df.write.csv(outputFp.toString())

  val results = List(
    s"inputFp: ${inputFp}",
    s"show(df):\n${show(df)}",
  )
  results.foreach(println)
}

/** Read a JSON file to df and then write to file. */
def dfIoJson(spark: SparkSession): Unit = {
  val inputFp = Paths.get("./data/input/ninjas.json")
  val outputFp = Paths.get("./data/output/ninjas.json")
  val df = readJson(spark, inputFp)
  writeJson(df, outputFp)

  // // Writes directory
  // df.write.json(outputFp.toString())

  val results = List(
    s"inputFp: ${inputFp}",
    s"show(df):\n${show(df)}",
  )
  results.foreach(println)
}

def dfDetails(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"df.columns: ${df.columns}",
    s"df.count: ${df.count}",
    s"df.describe: ${df.describe()}",
    s"df.dtypes: ${df.dtypes}",
    s"df.isEmpty: ${df.isEmpty}",
    s"df.isLocal: ${df.isLocal}",
    s"df.schema: ${df.schema}",
    s"df.summary: ${df.summary()}",
  )
  results.foreach(println)
}

def dfSelectColumns(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"""df.select("id"): ${df.select("id")}""",
    s"""df.select("first_name", "last_name"): ${df.select("first_name", "last_name")}""",
  )
  results.foreach(println)
}

def dfSelectRows(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"""df.first(): ${df.first()}""",
    s"""df.head(2): ${df.head(2)}""",
    s"""df.limit(2): ${df.limit(2)}""",
    s"""df.sample(0.2): ${df.sample(0.2)}""",
    s"""df.tail(2): ${df.tail(2)}""",
    s"""df.take(2): ${df.take(2)}""",
  )
  results.foreach(println)
}

def dfFilter(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"""df.filter(col("age") >= 26):\n${df.filter(col("age") >= 26)}""",
    s"""df.filter(col("age").isin(26, 27)):\n${df.filter(col("age").isin(26, 27))}""",
    s"""df.filter(col("last_name").contains("Uchiha")):\n${df.filter(
        col("last_name").contains("Uchiha")
      )}""",
    s"""df.filter(col("first_name").contains("a") && col("last_name").contains("a")):\n${df.filter(
        col("first_name").contains("a") && col("last_name").contains("a")
      )}""",
  )
  results.foreach(println)
}

def dfSelectExpressions(df: DataFrame): Unit = {
  val result_df = df.select(
    col("*"),
    (col("age") > 25).alias("older_than_25"),
    (col("age") + 25).alias("age_in_25_years"),
    (col("last_name").contains("Uchiha")).alias("is_uchiha"),
    when(col("first_name").isin("Kakashi", "Iruka"), "Sensei")
      .otherwise(col("last_name"))
      .alias("nickname")
  )

  val results = List(
    s"show(df):\n${show(df)}",
    s"show(result_df):\n${show(result_df)}",
  )
  results.foreach(println)
}

def dfWithColumn(df: DataFrame): Unit = {
  val with_col_result = df.withColumn("age_older", col("age") + 10)
  val with_cols_result = df.withColumns(
    Map(
      "age_older" -> (col("age") + 10),
      "age_much_older" -> (col("age") + 20),
    )
  )

  val results = List(
    s"show(df):\n${show(df)}",
    s"show(with_col_result):\n${show(with_col_result)}",
    s"show(with_cols_result):\n${show(with_cols_result)}",
  )
  results.foreach(println)
}

def dfSort(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"""df.sort(col("id").asc): ${df.sort(col("id").asc)}""",
    s"""df.sort(col("id").desc): ${df.sort(col("id").desc)}""",
    s"""df.sort(col("first_name").asc, col("last_name").asc): ${df
        .sort(col("first_name").asc, col("last_name").asc)}""",
  )
  results.foreach(println)
}

def dfRenameColumns(df: DataFrame): Unit = {
  val renames = Map("first_name" -> "LastName", "last_name" -> "LastName")
  val result = df.withColumnsRenamed(renames)

  val results = List(
    s"show(df):\n${show(df)}",
    s"renames:\n${renames}",
    s"show(result):\n${show(result)}",
  )
  results.foreach(println)
}

def dfDrop(df: DataFrame): Unit = {

  val result = df.drop(col("age"))
  val results = List(
    s"show(df):\n${show(df)}",
    s"show(result):\n${show(result)}",
  )
  results.foreach(println)
}

def dfHandleNull(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"show(df.na.fill(0.0)):\n${show(df.na.fill(0.0))}",
    s"""show(df.na.drop("all")):\n${show(df.na.drop("all"))}""",
    s"""show(df.na.drop(Seq("c"))):\n${show(df.na.drop(Seq("c")))}""",
  )
  results.foreach(println)

}

def dfHandleDuplicates(df: DataFrame): Unit = {
  val results = List(
    s"show(df):\n${show(df)}",
    s"show(df.distinct):\n${show(df.distinct)}",
    s"show(df.dropDuplicates):\n${show(df.dropDuplicates)}",
    s"""show(df.dropDuplicates(Seq("b", "d"))):\n${show(df.dropDuplicates(Seq("b", "d")))}""",
  )
  results.foreach(println)
}

def dfCastColumn(df: DataFrame): Unit = {
  val cols = Seq(col("a"), col("b"), col("c"))
  val schema = StructType(
    Seq(
      StructField("a", IntegerType, nullable = true),
      StructField("b", IntegerType, nullable = true),
      StructField("c", IntegerType, nullable = true),
    )
  )

  val results = List(
    s"show(df):\n${show(df)}",
    s"cols: ${cols}",
    s"schema: ${schema}",
    s"show(df.select(cols*).to(schema)):\n${show(df.select(cols*).to(schema))}",
  )
  results.foreach(println)

}

def dfTransform(df: DataFrame): Unit = {
  val double = (col: Column) => col * 2
  val mapDfCols = (df: DataFrame, fn: Column => Column) =>
    df.select(
      df.columns.map(c => fn(col(c)).alias(c))*
    )
  val doubleDf = (df: DataFrame) => mapDfCols(df, double)

  val results = List(
    s"show(df):\n${show(df)}",
    s"show(df.transform(doubleDf)):\n${show(df.transform(doubleDf))}",
  )
  results.foreach(println)
}

def dfJoin(df: DataFrame): Unit = {
  val left_df = df.select("id", "first_name")
  val right_df = df.select("id", "last_name")
  val joined_df = left_df.join(right_df, usingColumns = Seq("id"), joinType = "inner")

  val results = List(
    s"show(left_df):\n${show(left_df)}",
    s"show(right_df):\n${show(right_df)}",
    s"show(joined_df):\n${show(joined_df)}",
  )
  results.foreach(println)
}

def dfGroupby(df: DataFrame): Unit = {
  println("...")
}

def dfParallelize(spark: SparkSession): Unit = {
  val sc = spark.sparkContext
  val values = Seq(1, 2, 3, 4, 5)
  val fn = (n: Int) => n * 2
  val result = sc.parallelize(values).map(fn).collect().toList

  val results = List(
    s"values: ${values}",
    s"result: ${result}",
  )
  results.foreach(println)
}
