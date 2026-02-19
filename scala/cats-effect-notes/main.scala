//> using scala 3.7.4
//> using dep "io.circe::circe-core:0.14.15"
//> using dep "io.circe::circe-parser:0.14.15"
//> using dep "io.circe::circe-generic:0.14.15"
//> using dep "org.typelevel::cats-effect:3.6.3"
//> using dep "org.http4s::http4s-ember-client:0.23.33"
//> using dep "org.http4s::http4s-circe:0.23.33"
//> using dep "org.slf4j:slf4j-simple:2.0.17"

import cats.effect.*
import cats.effect.std.Semaphore
import cats.effect.unsafe.IORuntime
import cats.syntax.all.*
import io.circe.*
import io.circe.generic.auto.*
import io.circe.parser.*
import io.circe.syntax.*
import org.http4s.*
import org.http4s.Method.*
import org.http4s.circe.*
import org.http4s.client.*
import org.http4s.ember.client.*
import org.http4s.implicits.*
import org.typelevel.ci.CIStringSyntax

import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import scala.concurrent.duration.*
import scala.util.chaining.scalaUtilChainingOps

// ---
// Main
// ---

@main
def runExamples(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("simpleComprehension", () => handleEffect(simpleComprehension())),
    ("sleep", () => handleEffect(sleep())),
    ("parallelMap", () => handleEffect(parallelMap())),
    ("simpleThrowable", () => handleEffect(simpleThrowable())),
    ("simpleBlockingAsync", () => handleEffect(simpleBlockingAsync())),
    ("httpGet", () => handleEffect(httpGet())),
    ("httpPost", () => handleEffect(httpPost())),
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

def handleEffect[A](effect: IO[A]): A = {
  implicit val runtime: IORuntime = IORuntime.global
  effect.unsafeRunSync()
}

def getClient(): Resource[IO, Client[IO]] = {
  EmberClientBuilder.default[IO].build
}

def readFile(path: Path): String = {
  Files.readString(path)
}

def writeFile(path: Path, contents: String): Unit = {
  Files.write(path, contents.getBytes(StandardCharsets.UTF_8))
}

def copyFile(pathSrc: Path, pathDst: Path): Unit = {
  Files.copy(pathSrc, pathDst, StandardCopyOption.REPLACE_EXISTING)
}

def moveFile(pathSrc: Path, pathDst: Path): Unit = {
  Files.move(pathSrc, pathDst)
}

def deleteFile(path: Path): Unit = {
  Files.deleteIfExists(path)
}

// ---
// Examples
// ---

def simpleComprehension(): IO[Unit] = {
  for {
    a <- IO { 2 }
    b <- IO { 3 }
    result <- IO { a * b }
    _ <- IO.println(s"result: ${result}")
  } yield ()
}

def sleep(): IO[Unit] = {
  for {
    _ <- IO.println("Hello")
    _ <- IO.sleep(10.milliseconds)
    _ <- IO.println("World!")
  } yield ()
}

def parallelMap(): IO[Unit] = {
  val square = (n: Int) => IO(math.pow(n, 2)).delayBy(10.milliseconds)
  for {
    nums <- IO { (1 to 10).toList }
    sem <- Semaphore[IO](4)
    results <- nums.parTraverse(n => sem.permit.use(_ => square(n)))
    _ <- IO.println(s"results: ${results}")
  } yield ()
}

def divide(a: Double, b: Double): IO[Double] = {
  (a, b) match {
    case (_, 0.0) => IO.raiseError(new RuntimeException("Division by zero"))
    case (a, b)   => IO { a / b }
  }
}

def simpleThrowable(): IO[Unit] = {
  for {
    n1 <- IO { 1.0 }
    n2 <- IO { 2.0 }
    n3 <- IO { 0.0 }
    res1 <- divide(n1, n2)
    res2 <- divide(n3, n1)
    res3 <- divide(n1, n3).orElse(IO { 0.0 })
    results <- IO {
      List(
        s"n1: ${n1}",
        s"n2: ${n2}",
        s"n3: ${n3}",
        s"res1: ${res1}",
        s"res2: ${res2}",
        s"res3: ${res3}",
      )
    }
    _ <- results.traverse_(IO.println)
  } yield ()
}

def simpleBlockingAsync(): IO[Unit] = {
  for {
    // Directories
    dataDir <- IO { Paths.get("data") }
    inputDir <- IO { dataDir.resolve("input") }
    outputDir <- IO { dataDir.resolve("output") }
    // Files
    filename1 <- IO { inputDir.resolve("file1.txt") }
    filename2 <- IO { outputDir.resolve("file2.txt") }
    filename3 <- IO { outputDir.resolve("file3.txt") }
    // Actions
    _ <- IO.blocking { Files.createDirectories(inputDir) }
    _ <- IO.blocking { Files.createDirectories(outputDir) }
    contents1 = "Change is impossible in this fog of ignorance."
    _ <- IO.blocking { writeFile(filename1, contents1) }
    _ <- IO.blocking { copyFile(filename1, filename2) }
    contents2 <- IO.blocking { readFile(filename2) }
    _ <- IO.blocking { moveFile(filename2, filename3) }
    contents3 <- IO.blocking { readFile(filename3) }
    _ <- IO.blocking { Files.deleteIfExists(filename3) }
    _ <- IO.blocking { Files.deleteIfExists(filename1) }
    _ <- IO.blocking { Files.deleteIfExists(outputDir) }
    _ <- IO.blocking { Files.deleteIfExists(inputDir) }
    _ <- IO.blocking { Files.deleteIfExists(dataDir) }
    // Results
    results <- IO {
      List(
        s"dataDir: $dataDir",
        s"inputDir: $inputDir",
        s"outputDir: $outputDir",
        s"filename1: $filename1",
        s"filename2: $filename2",
        s"filename3: $filename3",
        s"contents1: $contents1",
        s"contents2: $contents2",
        s"contents3: $contents3"
      )
    }
    _ <- results.traverse_(IO.println)
  } yield ()
}

// ---
// HERE
// ---

final case class NewUser(id: Int, name: String)
final case class Address(street: String, suite: String, city: String, zipcode: String)
final case class User(id: Int, name: String, phone: String, address: Address)

def raiseForStatusDebug(response: Response[IO]): IO[Response[IO]] = {
  val status = response.status.code
  status match {
    case s if s >= 400 => {
      val body = response.as[String]
      val message = s"Request failed:\nstatus: ${status}\nbody: ${body}"
      IO.raiseError(new RuntimeException(message))
    }
    case _ => IO { response }
  }
}

def getUser(id: Int): IO[User] = {
  for {
    url <- IO.fromEither(Uri.fromString(s"https://jsonplaceholder.typicode.com/users/${id}"))
    headers <- IO {
      Headers(
        Header.Raw(ci"Accept", "application/json"),
        Header.Raw(ci"Content-Type", "application/json")
      )
    }
    req <- IO { Request[IO](method = GET, uri = url).withHeaders(headers) }
    res <- getClient().use(c => c.run(req).use(r => raiseForStatusDebug(r)))
    body <- res.as[String]
    user <- decode[User](body)
      .pipe(e => e.left.map(m => new RuntimeException(m)))
      .pipe(IO.fromEither)
  } yield user
}

def httpGet(): IO[Unit] = {
  for {
    user <- getUser(1)
    results <- IO { List(s"user: ${user}") }
    _ <- results.traverse_(IO.println)
  } yield ()
}

def createUser(newUser: NewUser): IO[NewUser] = {
  for {
    url <- IO.fromEither(Uri.fromString("https://jsonplaceholder.typicode.com/users"))
    headers <- IO {
      Headers(
        Header.Raw(ci"Accept", "application/json"),
        Header.Raw(ci"Content-Type", "application/json")
      )
    }
    req <- IO {
      Request[IO](method = POST, uri = url)
        .withEntity(newUser.asJson)
        .withHeaders(headers)
    }
    res <- getClient().use(c => c.run(req).use(r => raiseForStatusDebug(r)))
    body <- res.as[String]
    // NOTE: the json placeholder API just returns the input (on post request)
    newUser <- decode[NewUser](body)
      .pipe(e => e.left.map(m => new RuntimeException(m)))
      .pipe(IO.fromEither)
  } yield newUser
}

def httpPost(): IO[Unit] = {
  for {
    newUser <- IO { NewUser(id = 1, name = "Hiruzen Sarutobi") }
    created <- createUser(newUser)
    results <- IO { List(s"created: ${created}") }
    _ <- results.traverse_(IO.println)
  } yield ()
}
