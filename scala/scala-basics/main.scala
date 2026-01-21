//> using scala 3.7.4
//> using dep "com.lihaoyi::os-lib:0.11.6"

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
// Main
// ---

@main
def runExamples(): Unit = {
  val examples: List[(String, () => Unit)] = List(
    ("booleans", booleans),
    ("ints", ints),
    ("floats", floats),
    ("strings", strings),
    ("lists", lists),
    ("maps", maps),
    ("comprehensions", comprehensions),
    ("enums", enums),
    ("options", options),
    ("try-and-either", tryAndEither),
    ("either-comprehension", eitherComprehension),
    ("pattern-matching", patternMatching),
    ("control-flow", controlFlow),
    ("function-currying", functionCurrying),
    ("function-shorthand", functionShorthand),
    ("function-recursion", functionRecursion),
    ("function-piping", functionPiping),
    ("function-partial", functionPartial),
    ("case-classes", caseClasses),
    ("source", source),
    ("sys-env", sysEnv),
    ("os-lib", osLib),
    ("java-std-lib", javaStdLib),
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

def readFile(path: Path): Try[String] = {
  Using(Source.fromFile(path.toString)) { s => s.mkString }
}

// ---
// Examples
// ---

def booleans(): Unit = {
  val t = true
  val f = false

  val results = List(
    s"t: ${t}",
    s"f: ${f}",
    s"!t: ${!t}",
    s"!f: ${!f}",
    s"t && f: ${t && f}",
    s"t && t: ${t && t}",
    s"f && f: ${f && f}",
    s"t || f: ${t || f}",
    s"t || t: ${t || t}",
    s"f || f: ${f || f}",
    s"t ^ f: ${t ^ f}",
    s"t == t: ${t == t}",
  )
  results.foreach(println)
}

def ints(): Unit = {
  val n1 = 2
  val n2 = 3

  val results = List(
    s"n1: ${n1}",
    s"n2: ${n2}",
    s"n1 + n2: ${n1 + n2}",
    s"n1 - n2: ${n1 - n2}",
    s"n1 * n2: ${n1 * n2}",
    s"n1 / n2: ${n1 / n2}",
    s"n1 % n2: ${n1 % n2}",
    s"n1 < n2: ${n1 < n2}",
    s"n1 <= n2: ${n1 <= n2}",
    s"n1 > n2: ${n1 > n2}",
    s"n1 >= n2: ${n1 >= n2}",
    s"n1 == n2: ${n1 == n2}",
    s"n1 != n2: ${n1 != n2}",
  )
  results.foreach(println)
}

def floats(): Unit = {
  val n1 = 2.0
  val n2 = 3.0

  val results = List(
    s"n1: ${n1}",
    s"n2: ${n2}",
    s"n1 + n2: ${n1 + n2}",
    s"n1 - n2: ${n1 - n2}",
    s"n1 * n2: ${n1 * n2}",
    s"n1 / n2: ${n1 / n2}",
    s"n1 % n2: ${n1 % n2}",
    s"n1 < n2: ${n1 < n2}",
    s"n1 <= n2: ${n1 <= n2}",
    s"n1 > n2: ${n1 > n2}",
    s"n1 >= n2: ${n1 >= n2}",
    s"n1 == n2: ${n1 == n2}",
    s"n1 != n2: ${n1 != n2}",
    s"math.pow(n1, 2): ${math.pow(n1, 2)}",
    s"math.sqrt(n1): ${math.sqrt(n1)}",
  )
  results.foreach(println)
}

def strings(): Unit = {
  val who = "Quem são vocês?";
  val hey = "Hey!"
  val fired = "Help me boy or you're fired"
  val time = "It's okay, take your time"
  val sedan = "the owner of the white sedan, you left your lights on"
  val house = "Not even Squidward's house"
  val lastWords = "お前をずっと愛している"
  val patties = "People order our patties"
  val ready = "I'm ready!"
  val kicking = "Kicking? I want to do some kicking!"
  val ceiling = "Your ceiling is talking to me!"

  val results = List(
    s"who: ${who}",
    s"who.getBytes: ${who.getBytes.mkString(", ")}",
    s"who.length: ${who.length}",
    s"who.size: ${who.size}",
    s"""who.getBytes("UTF-8").length: ${who.getBytes("UTF-8").length}""",
    s"sedan: ${sedan}",
    s"sedan.capitalize: ${sedan.capitalize}",
    s"hey: ${hey}",
    s"""hey * 3: ${hey * 3}""",
    s"""hey ++ hey: ${hey ++ hey}""",
    s"""hey.concat(hey): ${hey.concat(hey)}""",
    s"house: ${house}",
    s"""house.contains("id"): ${house.contains("id")}""",
    s"fired: ${fired}",
    s"""fired.endsWith("fired"): ${fired.endsWith("fired")}""",
    s"lastWords: ${lastWords}",
    s"lastWords.nonEmpty: ${lastWords.nonEmpty}",
    s"patties: ${patties}",
    s"patties.reverse: ${patties.reverse}",
    s"ready: ${ready}",
    s"""ready.replace("re", "not re"): ${ready.replace("re", "not re")}""",
    s"kicking: ${kicking}",
    s"kicking.slice(11, 15): ${kicking.slice(11, 15)}",
    s"ceiling: ${ceiling}",
    s"""ceiling.split(" "): ${ceiling.split(" ").mkString(", ")}""",
    s"time: ${time}",
    s"""time.startsWith("It"): ${time.startsWith("It")}""",
  )
  results.foreach(println)
}

def lists(): Unit = {
  val l1 = List(1, 2, 3, 4, 5)
  val results = List(
    s"l1: ${l1}",
    s"0 :: l1: ${0 :: l1}",
    s"l1 ++ List(6): ${l1 ++ List(6)}",
    s"l1.contains(2): ${l1.contains(2)}",
    s"l1.count((n) => n > 3): ${l1.count((n) => n > 3)}",
    s"l1.distinct: ${l1.distinct}",
    s"l1.empty: ${l1.empty}",
    s"l1.exists((n) => n > 3): ${l1.exists((n) => n > 3)}",
    s"l1.filter((n) => n > 3): ${l1.filter((n) => n > 3)}",
    s"l1.find((n) => n > 3): ${l1.find((n) => n > 3)}",
    s"l1.findLast((n) => n > 3): ${l1.findLast((n) => n > 3)}",
    s"l1.fold(0)((acc, curr) => acc + curr): ${l1.fold(0)((acc, curr) => acc + curr)}",
    s"l1.forall((n) => n > 0): ${l1.forall((n) => n > 0)}",
    s"l1.grouped(2): ${l1.grouped(2)}",
    s"l1.head: ${l1.head}",
    s"l1.headOption: ${l1.headOption}",
    s"l1.isEmpty: ${l1.isEmpty}",
    s"l1.last: ${l1.last}",
    s"l1.lastOption: ${l1.lastOption}",
    s"l1.length: ${l1.length}",
    s"l1.map((n) => n * 2): ${l1.map((n) => n * 2)}",
    s"l1.partition((n) => n % 2 == 0): ${l1.partition((n) => n % 2 == 0)}",
    s"l1.reduce((acc, curr) => acc + curr): ${l1.reduce((acc, curr) => acc + curr)}",
    s"l1.reverse: ${l1.reverse}",
    s"l1.slice(1, 3): ${l1.slice(1, 3)}",
    s"l1.take(3): ${l1.take(3)}",
  )
  results.foreach(println)
}

def maps(): Unit = {
  val m1 = Map("a" -> 1, "b" -> 2, "c" -> 3)
  m1.foreach((k, v) => println(s"k: ${v}"))
  // TODO: fold, groupBy, map, partition, reduce
  val results = List(
    s"m1: ${m1}",
    s"""m1.concat(Map("d" -> 4)): ${m1.concat(Map("d" -> 4))}""",
    s"""m1.contains("a"): ${m1.contains("a")}""",
    s"""m1.empty: ${m1.empty}""",
    s"""m1.filter((k, v) => v % 2 == 0): ${m1.filter((k, v) => v % 2 == 0)}""",
    s"""m1.get("a"): ${m1.get("a")}""",
    s"""m1.getOrElse("a", 0): ${m1.getOrElse("a", 0)}""",
    s"""m1.head: ${m1.head}""",
    s"""m1.headOption: ${m1.headOption}""",
    s"""m1.isEmpty: ${m1.isEmpty}""",
    s"""m1.keys: ${m1.keys}""",
    s"""m1.last: ${m1.last}""",
    s"""m1.lastOption: ${m1.lastOption}""",
    s"""m1.size: ${m1.size}""",
    s"""m1.tail: ${m1.tail}""",
    s"""m1.take(2): ${m1.take(2)}""",
    s"""m1.values: ${m1.values}""",
  )
  results.foreach(println)
}

def comprehensions(): Unit = {
  val numbers = List(1, 2, 3, 4, 5)
  val result = {
    for n <- numbers if n % 2 == 0
    yield math.pow(n, 2)
  }

  val results = List(
    s"numbers: ${numbers}",
    s"result: ${result}",
  )
  results.foreach(println)
}

enum Color {
  case Red, Green, Blue
}

def enums(): Unit = {
  val colors = List(Color.Red, Color.Green, Color.Blue)
  val starters = colors.map(color =>
    color match {
      case Color.Red   => "Charmander"
      case Color.Blue  => "Squirtle"
      case Color.Green => "Bulbasaur"
    }
  )
  colors
    .zip(starters)
    .foreach((c, s) => {
      println(s"The starter for ${c} is ${s}")
    })
}

def options(): Unit = {
  val numbers = List(1, 2, 3, 4, 5)
  val greaterThan3 = numbers.find(n => n > 3)
  val greaterThan10 = numbers.find(n => n > 10)

  val someStr: Option[String] = Some("Is mayonnaise an instrument?")
  val noneStr: Option[String] = None

  val results = List(
    s"numbers: ${numbers}",
    s"greaterThan3: ${greaterThan3}",
    s"greaterThan10: ${greaterThan10}",
    s"someStr: ${someStr}",
    s"noneStr: ${noneStr}",
    s"someStr.filter(s => s.length < 10): ${someStr.filter(s => s.length < 10)}",
    s"""noneStr.getOrElse("Barnacles"): ${noneStr.getOrElse("Barnacles")}""",
    // NOTE: `get` panics for None
    s"someStr.get: ${someStr.get}",
    s"noneStr.isEmpty: ${noneStr.isEmpty}",
    s"someStr.map(s => s.toLowerCase()): ${someStr.map(s => s.toLowerCase())}",
    s"""noneStr.orElse(Some("Barnacles")): ${noneStr.orElse(Some("Barnacles"))}""",
  )
  results.foreach(println)
}

def unsafeDivide[T: Fractional](a: T, b: T): T = {
  // Cannot use `/` infix operator without importing implicits
  val f = implicitly[Fractional[T]]
  f.div(a, b)
  b match {
    case 0.0 => throw new RuntimeException("Divide by zero.")
    case _   => f.div(a, b)
  }
}

def safeDivide[T: Fractional](a: T, b: T): Try[T] = {
  // Can only use `/` infix operator when importing implicits
  import scala.math.Fractional.Implicits._
  b match {
    case 0.0 => Failure(new RuntimeException("Divide by zero."))
    case _   => Success(a / b)
  }
}

def eitherDivide[T: Fractional](a: T, b: T): Either[String, T] = {
  // Can only use `/` infix operator when importing implicits
  import scala.math.Fractional.Implicits._
  b match {
    case 0.0 => Left("Divide by zero.")
    case _   => Right(a / b)
  }
}

def tryAndEither(): Unit = {
  val n1 = 1.0
  val n2 = 0.0
  val n3 = 2.0
  val unsafeDivideSuccess = Try { unsafeDivide(n1, n3) }
  val unsafeDivideFailure = Try { unsafeDivide(n1, n2) }
  val safeDivideSuccess = safeDivide(n1, n3)
  val safeDivideFailure = safeDivide(n1, n2)
  val eitherDivideSuccess = eitherDivide(n1, n3)
  val eitherDivideFailure = eitherDivide(n1, n2)
  val results = List(
    s"n1: ${n1}",
    s"n2: ${n2}",
    s"n3: ${n3}",
    s"unsafeDivideSuccess: ${unsafeDivideSuccess}",
    s"unsafeDivideFailure: ${unsafeDivideFailure}",
    s"safeDivideSuccess: ${safeDivideSuccess}",
    s"safeDivideFailure: ${safeDivideFailure}",
    s"eitherDivideSuccess: ${eitherDivideSuccess}",
    s"eitherDivideFailure: ${eitherDivideFailure}",
  )
  results.foreach(println)
}

def eitherComprehension(): Unit = {
  val n1 = 1.0
  val n2 = 0.0
  val n3 = 2.0

  val result1 = for {
    r1 <- safeDivide(n1, n3).toEither.left.map(e => e.getMessage)
    r2 <- eitherDivide(n1, n3)
    r3 <- safeDivide(n2, n3).toEither.left.map(e => e.getMessage)
    // This will fail
    r4 <- eitherDivide(n1, n2)
    output <- Right(r1 + r2 + r3 + r4)
  } yield output

  val result2 = for {
    r1 <- safeDivide(n1, n3).toEither.left.map(e => e.getMessage)
    r2 <- eitherDivide(n1, n3)
    r3 <- safeDivide(n2, n3).toEither.left.map(e => e.getMessage)
    r4 <- eitherDivide(n2, n3)
    output <- Right(r1 + r2 + r3 + r4)
  } yield output

  val handleDivideResult = (res: Either[String, Double]) =>
    res match {
      case Right(v)  => Success(v)
      case Left(msg) => {
        println(msg)
        Failure(new RuntimeException("Failed to divide"))
      }
    }

  val result3 = for {
    r1 <- safeDivide(n1, n3)
    r2 <- eitherDivide(n1, n3) pipe handleDivideResult
    r3 <- safeDivide(n2, n3)
    // This will fail
    r4 <- eitherDivide(n1, n2) pipe handleDivideResult
    output <- Success(r1 + r2 + r3 + r4)
  } yield output

  val result4 = for {
    r1 <- safeDivide(n1, n3)
    r2 <- eitherDivide(n1, n3) pipe handleDivideResult
    r3 <- safeDivide(n2, n3)
    r4 <- eitherDivide(n2, n3) pipe handleDivideResult
    output <- Success(r1 + r2 + r3 + r4)
  } yield output

  val results = List(
    s"n1: ${n1}",
    s"n2: ${n2}",
    s"n3: ${n3}",
    s"result1: ${result1}",
    s"result2: ${result2}",
    s"result3: ${result3}",
    s"result4: ${result4}",
  )
  results.foreach(println)

}

def patternMatching(): Unit = {
  val path = Paths.get("./Justfile")
  val result = readFile(path)
  result match {
    case Success(contents) => {
      val len = contents.length
      println(s"The file ${path} has ${len} characters")
    }
    case Failure(error) => {
      println(s"Could not read file ${path}")
      println(error)
    }
  }
}

def controlFlow(): Unit = {
  // TODO: if/else, while, try/catch/finally
  val a = 1
  val b = 2
  val greater = if a > b then a else b
  val results = List(
    s"a: ${a}",
    s"b: ${b}",
    s"greater: ${greater}",
  )
  results.foreach(println)
}

def functionCurrying(): Unit = {
  val add = (a: Int) => (b: Int) => a + b
  val a = 1
  val b = 2
  val addResult = add(a)(b)

  val results = List(
    s"a: ${a}",
    s"b: ${b}",
    s"addResult: ${addResult}",
  )
  results.foreach(println)
}

def functionShorthand(): Unit = {
  val numbers = List(1, 2, 3, 4, 5)
  val evens = numbers.map(_ * 2)

  val results = List(
    s"numbers: ${numbers}",
    s"evens: ${evens}",
  )
  results.foreach(println)
}

def find[T](values: List[T])(fn: T => Boolean): Option[T] = {
  values match {
    case h :: t => {
      if (fn(h)) Some(h) else find(t)(fn)
    }
    case _ => None
  }
}

def functionRecursion(): Unit = {
  val numbers = List(1, 2, 3, 4, 5)
  val result = find(numbers)(n => n >= 3)

  val results = List(
    s"numbers: ${numbers}",
    s"result: ${result}",
  )
  results.foreach(println)
}

def functionPiping(): Unit = {
  val values = List(1, 2, 3, 4, 5)

  // Chaining ops (standard)
  val result = values
    .pipe(l => l.filter(v => v % 2 == 0))
    .pipe(l => l.map(v => v * 2))
    .pipe(l => l.take(3))
    .pipe(l => l.mkString("List(", ", ", ")"))

  // // Custom pipe operator extension
  // extension [A](a: A) def |>[B](f: A => B): B = f(a)
  // val result = values
  //   |> (l => l.filter(v => v % 2 == 0))
  //   |> ((l) => l.map(v => v * 2))
  //   |> (l => l.take(3))
  //   |> (l => l.mkString("List(", ", ", ")"))

  val results = List(
    s"values: ${values}",
    s"result: ${result}",
  )
  results.foreach(println)
}

def functionPartial(): Unit = {
  case class Ninja(firstName: String, lastName: String)
  val values = List(
    ("Kakashi", "Hatake"),
    ("Itachi", "Uchiha"),
    ("Shisui", "Uchiha"),
  )
  // Partial function literal
  val ninjas = values.map({ case (f, l) => Ninja(f, l) })
  val results = List(
    s"values: ${values}",
    s"ninjas: ${ninjas}",
  )
  results.foreach(println)

  // // Similar version using destructure
  // val ninjas = values.map(v => {
  //   val (f, l) = v
  //   Ninja(f, l)
  // })

  // // Similar version using single-case match
  // val ninjas = values.map(v =>
  //   v match {
  //     case (f, l) => Ninja(f, l)
  //   }
  // )

}

def caseClasses(): Unit = {
  case class Ninja(name: String, age: Int, village: String)

  val ninja = Ninja("Kakashi", 30, "Leaf")
  println(ninja)
}

def source(): Unit = {
  val path = Paths.get("./Justfile")
  val file = readFile(path).map(s => s"File has ${s.length} chars")

  val results = List(
    s"path: ${path}",
    s"file: ${file}",
  )
  results.foreach(println)
}

def sysEnv(): Unit = {
  val env = scala.sys.env
  val home = env.get("HOME")
  val term = env.get("TERM")

  val results = List(
    s"""home: ${home}""",
    s"""term: ${term}""",
  )
  results.foreach(println)
}

def osLib(): Unit = {
  // https://github.com/com-lihaoyi/os-lib
  println("...")
}

def javaStdLib(): Unit = {
  // java.crypto
  // java.lang.reflect
  // java.nio
  // java.time
  // java.util
  println("...")
}
