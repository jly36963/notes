//> using jvm "25"
//> using scala 3.7.4
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"
//> using dep "com.github.haifengl::smile-scala:5.1.0"

import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import org.apache.commons.csv.CSVFormat
import smile.data.*
import smile.data.DataFrame
import smile.data.`type`.*
import smile.data.`type`.DataType
import smile.data.`type`.StructField
import smile.data.`type`.StructType
import smile.data.formula.*
import smile.data.vector.IntVector
import smile.data.vector.StringVector
import smile.data.vector.ValueVector
import smile.io.*
import smile.io.Read
import smile.io.Write

import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.Comparator
import scala.io.Source
import scala.jdk.CollectionConverters.*
import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.Using
import scala.util.chaining.scalaUtilChainingOps

// ---
// Types
// ---

case class Ninja(firstName: String, lastName: String, age: Int)

// ---
// Main
// ---

@main
def runExamples(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("df-io-csv", dfIoCsv),
    ("df-from-columns", dfFromColumns),
    ("df-from-rows", dfFromRows),
    ("df-inspect", dfInspect),
    ("df-column", dfColumn),
    ("df-select", dfSelect),
    ("df-filter", dfFilter),
    ("df-add-columns", dfAddColumns),
    ("df-drop-columns", dfDropColumns),
    ("df-sort", dfSort),
    ("df-groupby", dfGroupby),
    ("df-join", dfJoin),
    ("df-concat", dfConcat),
  )

  scenarios.foreach((s) => {
    val (title, fn) = s
    println(s"\n${title.toUpperCase()}\n")
    fn()
  })
}

// ---
// Utils
// ---

def readFile(path: Path): Try[String] = {
  Using(Source.fromFile(path.toString)) { s => s.mkString }
}

def writeFile(path: Path, contents: String): Try[Unit] = {
  Try(Files.write(path, contents.getBytes(StandardCharsets.UTF_8)))
}

def readCsv(path: Path): Try[DataFrame] = {
  val format = CSVFormat.DEFAULT.withHeader()
  Try(Read.csv(path, format))
}

def writeCsv(df: DataFrame, path: Path): Try[Unit] = {
  Try(Write.csv(df, path))
}

def cloneDf(df: DataFrame): DataFrame = {
  DataFrame.of(df.schema(), df.stream())
}

def withColumn(df: DataFrame, name: String, values: ValueVector): DataFrame = {
  // NOTE: mutates in-place
  df.pipe(cloneDf).set(name, values)
}

def withoutColumns(df: DataFrame, names: String*): DataFrame = {
  // NOTE: mutates in-place
  df.pipe(cloneDf).drop(names*)
}

// ---
// Examples
// ---

def dfIoCsv(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get
  val outputPath = Paths.get("./data/output/ninjas.csv")
  writeCsv(df, outputPath)

  val results = List(
    s"inputPath: ${inputPath}",
    s"outputPath: ${outputPath}",
    s"df:\n${df}",
  )
  results.foreach(println)
}

def dfFromColumns(): Unit = {
  val ninjas = Seq(
    Ninja("Kakashi", "Hatake", 27),
    Ninja("Tenzo", "Yamato", 26),
    Ninja("Iruka", "Umino", 25),
    Ninja("Itachi", "Uchiha", 21),
  )

  val firstNames = ninjas.map(n => n.firstName)
  val lastNames = ninjas.map(n => n.lastName)
  val ages = ninjas.map(n => n.age)

  val df = DataFrame(
    StringVector("first_name", firstNames.toArray),
    StringVector("lastName", lastNames.toArray),
    IntVector("age", ages.toArray),
  )

  val results = List(
    s"ninjas: ${ninjas}",
    s"df:\n${df}",
  )
  results.foreach(println)
}

def dfFromRows(): Unit = {
  val ninjas = List(
    Ninja("Kakashi", "Hatake", 27),
    Ninja("Tenzo", "Yamato", 26),
    Ninja("Iruka", "Umino", 25),
    Ninja("Itachi", "Uchiha", 21),
  )

  // // From List (doesn't work?)
  // val df = DataFrame.of(classOf[Ninja], ninjas.asJava)

  // From struct type and tuples
  val schema = new StructType(
    new StructField("first_name", DataTypes.StringType),
    new StructField("last_name", DataTypes.StringType),
    new StructField("age", DataTypes.IntType),
  )
  val tuples = ninjas.map({ case Ninja(f, l, a) => Tuple.of(schema, Array[Any](f, l, a)) })
  val df = DataFrame.of(schema, tuples.asJava)

  val results = List(
    s"ninjas: ${ninjas}",
    s"df:\n${df}",
  )
  results.foreach(println)
}

def dfInspect(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val results = List(
    s"df:\n${df}",
    s"df.size: ${df.size}",
    s"df.shape:\n${df.shape}",
    s"df.isEmpty:\n${df.isEmpty}",
    s"df.dtypes:\n${df.dtypes}",
    s"df.names:\n${df.names}",
    s"df.ncol:\n${df.ncol}",
    s"df.nrow:\n${df.nrow}",
    // s"df.describe:\n${df.describe}",
    // s"df.columns: ${df.columns}",
  )
  results.foreach(println)
}

def dfColumn(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get
  val col = df.column("first_name")

  val results = List(
    s"df:\n${df}",
    s"col:\n${col}",
  )
  results.foreach(println)
}

def dfSelect(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df2 = df.select("first_name", "last_name", "age")
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfFilter(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df2 = df.filter(row => row.getInt("age") > 25)
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfAddColumns(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val agePlus10 = df
    .column("age")
    .toIntArray()
    .map(v => v + 10)
    .pipe(v => IntVector("age_plus_10", v))

  val df2 = withColumn(df, "age_plus_10", agePlus10)
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfDropColumns(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df2 = withoutColumns(df, "id")
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfSort(): Unit = {
  // No built-in sort
  println("...")
}

def dfGroupby(): Unit = {
  // Groupby produces Map[K, DataFrame]
  println("...")
}

def dfJoin(): Unit = {
  // Simple joins only (on index)
  println("...")
}

def dfConcat(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get
  val (df1, df2) = df.partition(row => row.getString("first_name").startsWith("I"))
  val df3 = df1.concat(df2)

  val results = List(
    s"df:\n${df}",
    s"df1:\n${df1}",
    s"df2:\n${df2}",
    s"df3:\n${df3}",
  )
  results.foreach(println)
}
