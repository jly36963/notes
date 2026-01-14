//> using scala 3.7.4
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"
//> using dep "tech.tablesaw:tablesaw-core:0.44.4"
//> using dep "tech.tablesaw:tablesaw-json:0.44.4"

import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import tech.tablesaw.api.*
import tech.tablesaw.io.Destination
import tech.tablesaw.io.csv.*
import tech.tablesaw.io.json.*

import java.io.StringWriter
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import scala.io.Source
import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.Using
import scala.util.chaining.scalaUtilChainingOps

// ---
// Types
// ---

case class Ninja(name: String, age: Int, village: String)

// ---
// Main
// ---

@main
def runExamples(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("dfIoCsv", dfIoCsv),
    ("dfIoJson", dfIoJson),
    ("dfFromColumns", dfFromColumns),
    ("dfFromRows", dfFromRows),
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

def readCsv(path: Path): Try[Table] = {
  val options = CsvReadOptions.builder(path.toString).separator(',').header(true).build
  Try(Table.read().usingOptions(options))
}

def writeCsv(df: Table, path: Path): Try[Unit] = {
  val options = CsvWriteOptions.builder(path.toString).separator(',').header(true).build
  Try(df.write.usingOptions(options))
}

def writeCsvString(df: Table, path: Path): String = {
  val writer = new StringWriter()
  df.write.csv(writer)
  writer.toString
}

def readJson(path: Path): Try[Table] = {
  val options = JsonReadOptions.builder(path.toString).build
  Try(Table.read().usingOptions(options))
}

def writeJson(df: Table, path: Path): Try[Unit] = {
  val destination = new Destination(path.toFile)
  val options = JsonWriteOptions.builder(destination).build
  Try(df.write.usingOptions(options))

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

def dfIoJson(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.json")
  val df = readJson(inputPath).get
  val outputPath = Paths.get("./data/output/ninjas.json")
  writeJson(df, outputPath)

  val results = List(
    s"inputPath: ${inputPath}",
    s"outputPath: ${outputPath}",
    s"df:\n${df}",
  )
  results.foreach(println)
}

def dfFromColumns(): Unit = {
  val df = Table.create(
    "ninjas",
    StringColumn.create("first_name", Seq("Kakashi", "Tenzo", "Iruka", "Itachi")*),
    StringColumn.create("lastName", Seq("Hatake", "Yamato", "Umino", "Uchiha")*),
    IntColumn.create("age", Seq(27, 26, 25, 21)*),
  )

  // // Filter rows
  // val adultsDf = df.where(df.intColumn("age").isGreaterThan(18))

  // // Add a derived column
  // val adultMask = df.intColumn("age").isGreaterThanOrEqualTo(18)
  // df.addColumns(adultMask.setName("is_adult"))

  val results = List(
    s"df:\n${df}",
  )
  results.foreach(println)
}

def dfFromRows(): Unit = {
  case class Ninja(firstName: String, lastName: String, age: Int)

  val dfFromList = (ninjas: List[Ninja]) => {
    val fnc = StringColumn.create("first_name")
    val lnc = StringColumn.create("last_name")
    val ac = IntColumn.create("age")
    ninjas.foreach({
      case Ninja(fn, ln, a) => {
        fnc.append(fn)
        lnc.append(ln)
        ac.append(a)
      }
    })
    Table.create("ninjas", fnc, lnc, ac)
  }

  val ninjas = List(
    Ninja("Kakashi", "Hatake", 27),
    Ninja("Tenzo", "Yamato", 26),
    Ninja("Iruka", "Umino", 25),
    Ninja("Itachi", "Uchiha", 21),
  )
  val df = dfFromList(ninjas)

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
    s"df.rowCount: ${df.rowCount}",
    s"df.columnNames: ${df.columnNames}",
  )
  results.foreach(println)
}

def dfSelect(): Unit = {}
def dfFilter(): Unit = {}
def dfAddColumns(): Unit = {}
