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
import tech.tablesaw.api.Table
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
    ("dfInspect", dfInspect),
    ("dfColumn", dfColumn),
    ("dfSelect", dfSelect),
    ("dfFilter", dfFilter),
    ("dfAddColumns", dfAddColumns),
    ("dfDropColumns", dfDropColumns),
    ("dfSort", dfSort),
    ("dfGroupby", dfGroupby),
    ("dfJoin", dfJoin),
    ("dfConcat", dfConcat),
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
    s"df.columnNames: ${df.columnNames}",
    s"df.rowCount: ${df.rowCount}",
    s"df.shape:\n${df.shape}",
    s"df.isEmpty:\n${df.isEmpty}",
    s"df.types:\n${df.types}",
    s"df.structure:\n${df.structure}",
    // s"df.typeArray:\n${df.typeArray}",
    // s"df.summary:\n${df.summary}",
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

  val df2 = df.selectColumns("first_name", "last_name", "age")
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfFilter(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df2 = df.where(df.intColumn("age").isGreaterThanOrEqualTo(25))
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)

}

def dfAddColumns(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val age_plus_10 = df.intColumn("age").map(v => v + 10).setName("age_plus_10")
  val df2 = df.copy().addColumns(age_plus_10) // NOTE: mutates in-place
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfDropColumns(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df2 = df.copy().removeColumns("id") // NOTE: mutates in-place
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfSort(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df2 = df.sortOn("first_name")
  val results = List(
    s"df:\n${df}",
    s"df2:\n${df2}",
  )
  results.foreach(println)
}

def dfGroupby(): Unit = {
  println("...")
}

def dfJoin(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val left_df = df.selectColumns("id", "first_name")
  val right_df = df.selectColumns("id", "last_name")
  val joined_df = left_df.joinOn("id").inner(right_df)

  val results = List(
    s"df:\n${df}",
    s"left_df:\n${left_df}",
    s"right_df:\n${right_df}",
    s"joined_df:\n${joined_df}",
  )
  results.foreach(println)
}

def dfConcat(): Unit = {
  val inputPath = Paths.get("./data/input/ninjas.csv")
  val df = readCsv(inputPath).get

  val df1 = df.first(2)
  val df2 = df.last(2)
  val df3 = df1.copy().append(df2) // NOTE: mutates in-place

  val results = List(
    s"df:\n${df}",
    s"df1:\n${df1}",
    s"df2:\n${df2}",
    s"df3:\n${df3}",
  )
  results.foreach(println)
}
