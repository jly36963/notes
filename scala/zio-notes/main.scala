//> using scala 3.7.4
//> using dep "dev.zio::zio:2.1.24"
//> using dep "dev.zio::zio-streams:2.1.24"
//> using dep "dev.zio::zio-json:0.9.0"
//> using dep "dev.zio::zio-http:3.8.1"

import zio.*
import zio.http.*
import zio.json.*

import java.nio.charset.Charset
import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
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
    ("simpleTask", () => handleEffect(simpleTask())),
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

def handleEffect(effect: ZIO[Any, Any, Any]): Unit = {
  Unsafe.unsafe { implicit u =>
    Runtime.default.unsafe.run(effect)
  }
}

// ---
// Examples
// ---

def simpleComprehension(): Task[Unit] = {
  for {
    a <- ZIO.succeed(2)
    b <- ZIO.succeed(3)
    result <- ZIO.succeed(a * b)
    _ <- Console.printLine(s"result: ${result}")
  } yield ()
}

def sleep(): Task[Unit] = {
  for {
    _ <- Console.printLine("Hello")
    _ <- ZIO.sleep(10.milliseconds)
    _ <- Console.printLine("World!")
  } yield ()
}

def parallelMap(): Task[Unit] = {
  val square = (n: Int) => ZIO.succeed(math.pow(n, 2)).delay(10.milliseconds)
  for {
    nums <- ZIO.succeed(1 to 10)
    sem <- Semaphore.make(4)
    results <- ZIO.foreachPar(nums)(n => sem.withPermit(square(n)))
    _ <- Console.printLine(s"results: ${results}")
  } yield ()
}

def divide(a: Double, b: Double): Task[Double] = {
  (a, b) match {
    case (_, 0.0) => ZIO.fail(new RuntimeException("division by zero"))
    case (a, b)   => ZIO.succeed(a / b)
  }
}

def simpleTask(): Task[Unit] = {
  for {
    n1 <- ZIO.succeed(1.0)
    n2 <- ZIO.succeed(2.0)
    n3 <- ZIO.succeed(0.0)
    res1 <- divide(n1, n2)
    res2 <- divide(n3, n1)
    res3 <- divide(n1, n3).orElse(ZIO.succeed(0.0))
    results <- ZIO.succeed(
      List(
        s"n1: ${n1}",
        s"n2: ${n2}",
        s"n3: ${n3}",
        s"res1: ${res1}",
        s"res2: ${res2}",
        s"res3: ${res3}",
      )
    )
    _ <- ZIO.foreach(results)(v => Console.printLine(v))
  } yield ()
}

def readFileBytesToString(path: Path): String = {
  val bytes = Files.readAllBytes(path)
  new String(bytes, StandardCharsets.UTF_8)
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

def simpleBlockingAsync(): Task[Unit] = {
  for {
    // Directories
    dataDir <- ZIO.succeed(Paths.get("data"))
    inputDir <- ZIO.succeed(dataDir.resolve("input"))
    outputDir <- ZIO.succeed(dataDir.resolve("output"))
    // Files
    filename1 <- ZIO.succeed(inputDir.resolve("file1.txt"))
    filename2 <- ZIO.succeed(outputDir.resolve("file2.txt"))
    filename3 <- ZIO.succeed(outputDir.resolve("file3.txt"))
    // Actions
    _ <- ZIO.attemptBlocking { Files.createDirectories(inputDir) }
    _ <- ZIO.attemptBlocking { Files.createDirectories(outputDir) }
    contents1 <- ZIO.succeed("Change is impossible in this fog of ignorance.")
    _ <- ZIO.attemptBlocking { writeFile(filename1, contents1) }
    _ <- ZIO.attemptBlocking { copyFile(filename1, filename2) }
    contents2 <- ZIO.attemptBlocking { readFile(filename2) }
    _ <- ZIO.attemptBlocking { moveFile(filename2, filename3) }
    contents3 <- ZIO.attemptBlocking { readFile(filename3) }
    _ <- ZIO.attemptBlocking { Files.deleteIfExists(filename3) }
    _ <- ZIO.attemptBlocking { Files.deleteIfExists(filename1) }
    _ <- ZIO.attemptBlocking { Files.deleteIfExists(outputDir) }
    _ <- ZIO.attemptBlocking { Files.deleteIfExists(inputDir) }
    _ <- ZIO.attemptBlocking { Files.deleteIfExists(dataDir) }
    // Results
    results <- ZIO.succeed(
      List(
        s"dataDir: ${dataDir}",
        s"inputDir: ${inputDir}",
        s"outputDir: ${outputDir}",
        s"filename1: ${filename1}",
        s"filename2: ${filename2}",
        s"filename3: ${filename3}",
        s"contents1: ${contents1}",
        s"contents2: ${contents2}",
        s"contents3: ${contents3}",
      )
    )
    _ <- ZIO.foreach(results)(v => Console.printLine(v))
  } yield ()
}

def raiseForStatusDebug(response: Response): Response = {
  val status = response.status.code
  status match {
    case s if s >= 400 => {
      val body = response.body.asString
      val message = s"Request failed:\nstatus: ${status}\nbody: ${body}"
      throw new RuntimeException(message)
    }
    case _ => response
  }
}

final case class NewUser(id: Int, name: String) derives JsonDecoder
final case class User(id: Int, name: String, phone: String, address: Address) derives JsonDecoder
final case class Address(street: String, suite: String, city: String, zipcode: String)
    derives JsonDecoder

def getUser(id: Int) = {
  for {
    url <- ZIO.succeed { s"https://jsonplaceholder.typicode.com/users/${id}" }
    headers <- ZIO.succeed {
      Map("Accept" -> "application/json", "Content-Type" -> "application/json")
    }
    req <- ZIO.succeed { Request.get(url).addHeaders(headers) }
    res <- ZClient.request(req)
    res <- ZIO.attempt { raiseForStatusDebug(res) }
    body <- res.body.asString
    user <- body
      .fromJson[User]
      .pipe(e => e.left.map(m => new RuntimeException(m)))
      .pipe(ZIO.fromEither)
  } yield user
}

def httpGet(): Task[Unit] = {
  val effect = for {
    user <- getUser(1)
    results <- ZIO.succeed { List(s"user: ${user}") }
    _ <- ZIO.foreach(results)(v => Console.printLine(v))
  } yield ()

  effect.provide(
    ZClient.default,
    Scope.default
  )
}

def createUser(newUser: NewUser) = {
  implicit val encoder: JsonEncoder[NewUser] = DeriveJsonEncoder.gen[NewUser]
  for {
    url <- ZIO.succeed { s"https://jsonplaceholder.typicode.com/users" }
    headers <- ZIO.succeed {
      Map("Accept" -> "application/json", "Content-Type" -> "application/json")
    }
    body <- ZIO.succeed { Body.fromString(newUser.toJson) }
    req <- ZIO.succeed { Request.post(url, body).addHeaders(headers) }
    res <- ZClient.request(req)
    res <- ZIO.attempt { raiseForStatusDebug(res) }
    body <- res.body.asString
    // NOTE: the json placeholder API just returns the input (on post request)
    newUser <- body
      .fromJson[NewUser]
      .pipe(e => e.left.map(m => new RuntimeException(m)))
      .pipe(ZIO.fromEither)
  } yield newUser
}

def httpPost(): Task[Unit] = {
  val effect = for {
    newUser <- ZIO.succeed { NewUser(id = 1, name = "Hiruzen Sarutobi") }
    created <- createUser(newUser)
    results <- ZIO.succeed { List(s"created: ${created}") }
    _ <- ZIO.foreach(results)(v => Console.printLine(v))
  } yield ()

  effect.provide(
    ZClient.default,
    Scope.default
  )
}
