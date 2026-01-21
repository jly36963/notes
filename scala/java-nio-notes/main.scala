//> using scala 3.7.4

import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.chaining.scalaUtilChainingOps

@main
def run(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("fs-throw", fsThrow),
    ("fs-try-comprehension", fsTryComprehension),
  )

  scenarios.foreach((s) => {
    val (title, fn) = s
    println(s"\n${title.toUpperCase()}\n")
    fn()
  })
}

def fsThrow(): Unit = {
  val dataDir = Paths.get("data")
  val inputDir = dataDir.resolve("input")
  val outputDir = dataDir.resolve("output")

  val filename1 = inputDir.resolve("file1.txt")
  val filename2 = outputDir.resolve("file2.txt")
  val filename3 = outputDir.resolve("file3.txt")

  Files.createDirectories(inputDir)
  Files.createDirectories(outputDir)
  val contents1 = "Change is impossible in this fog of ignorance.";
  Files.write(filename1, contents1.getBytes(StandardCharsets.UTF_8))
  Files.copy(filename1, filename2, StandardCopyOption.REPLACE_EXISTING)
  val contents2 = Files.readString(filename2)
  Files.move(filename2, filename3)
  val contents3 = Files.readString(filename3)
  Files.deleteIfExists(filename3)
  Files.deleteIfExists(filename1)
  Files.deleteIfExists(outputDir)
  Files.deleteIfExists(inputDir)
  Files.deleteIfExists(dataDir)

  val results = List(
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
  results.foreach(println)
}

def fsTryComprehension(): Unit = {
  val dataDir = Paths.get("data")
  val inputDir = dataDir.resolve("input")
  val outputDir = dataDir.resolve("output")

  val filename1 = inputDir.resolve("file1.txt")
  val filename2 = outputDir.resolve("file2.txt")
  val filename3 = outputDir.resolve("file3.txt")

  for {
    _ <- Try(Files.createDirectories(inputDir))
    _ <- Try(Files.createDirectories(outputDir))
    contents1 <- Success("Change is impossible in this fog of ignorance.");
    _ <- Try(Files.write(filename1, contents1.getBytes(StandardCharsets.UTF_8)))
    _ <- Try(Files.copy(filename1, filename2, StandardCopyOption.REPLACE_EXISTING))
    contents2 <- Success(Files.readString(filename2))
    _ <- Try(Files.move(filename2, filename3))
    contents3 <- Success(Files.readString(filename3))
    _ <- Try(Files.deleteIfExists(filename3))
    _ <- Try(Files.deleteIfExists(filename1))
    _ <- Try(Files.deleteIfExists(outputDir))
    _ <- Try(Files.deleteIfExists(inputDir))
    _ <- Try(Files.deleteIfExists(dataDir))
    _ <- {
      val results = List(
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
      results.foreach(println)
      Success(())
    }
  } yield ()

}
