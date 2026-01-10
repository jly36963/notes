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
import org.apache.spark.sql.DataFrame
import org.apache.spark.sql.Encoder
import org.apache.spark.sql.Encoders
import org.apache.spark.sql.Row
import org.apache.spark.sql.SparkSession
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

  val examples: List[(String, () => Unit)] = List(
    ("df-from-list-of-tuples", () => dfFromListOfTuples(spark)),
    ("df-from-list-of-classes", () => dfFromListOfClasses(spark)),
    ("df-io-csv", () => dfIoCsv(spark)),
    ("df-io-json", () => dfIoJson(spark)),
    ("df-details", () => dfDetails(spark)),
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

def showString(df: DataFrame): String = {
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

def readCsv(spark: SparkSession, filepath: String): DataFrame = {
  spark.read.format("csv").option("header", "true").option("inferSchema", "true").load(filepath)
}

def writeCsv(df: DataFrame, path: Path): Unit = {
  val content = dfToCsv(df)
  Files.write(path, content.getBytes(StandardCharsets.UTF_8))
}

def readJson(spark: SparkSession, filepath: String): DataFrame = {
  spark.read.option("multiLine", true).json(filepath)
}

def writeJson(df: DataFrame, path: Path): Unit = {
  val content = dfToJson(df)
  Files.write(path, content.getBytes(StandardCharsets.UTF_8))
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
    s"showString(df):\n${showString(df)}",
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
    s"showString(df):\n${showString(df)}",
    s"output: ${output}",
  )
  results.foreach(println)
}

/** Read a CSV file to df and then write to file. */
def dfIoCsv(spark: SparkSession): Unit = {
  val inputFp = Paths.get("./data/input/ninjas.csv")
  val outputFp = Paths.get("./data/output/ninjas.csv")
  val df = readCsv(spark, inputFp.toString())
  writeCsv(df, outputFp)

  // // Writes directory
  // df.write.csv(outputFp.toString())

  val results = List(
    s"inputFp: ${inputFp}",
    s"showString(df):\n${showString(df)}",
  )
  results.foreach(println)
}

/** Read a JSON file to df and then write to file. */
def dfIoJson(spark: SparkSession): Unit = {
  val inputFp = Paths.get("./data/input/ninjas.json")
  val outputFp = Paths.get("./data/output/ninjas.json")
  val df = readJson(spark, inputFp.toString())
  writeJson(df, outputFp)

  // // Writes directory
  // df.write.json(outputFp.toString())

  val results = List(
    s"inputFp: ${inputFp}",
    s"showString(df):\n${showString(df)}",
  )
  results.foreach(println)
}

def dfDetails(spark: SparkSession): Unit = {
  val inputFp = Paths.get("./data/input/ninjas.json")
  val df = readJson(spark, inputFp.toString())

  val results = List(
    s"showString(df):\n${showString(df)}",
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
