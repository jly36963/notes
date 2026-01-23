//> using scala 3.7.4

//> using dep "org.bytedeco:javacv-platform:1.5.12"

import org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_GRAYSCALE
import org.bytedeco.opencv.global.opencv_imgcodecs.imread
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2HLS
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2RGB
import org.bytedeco.opencv.global.opencv_imgproc.cvtColor
import org.bytedeco.opencv.opencv_core.Mat

import java.nio.charset.StandardCharsets
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import scala.util.Failure
import scala.util.Success
import scala.util.Try
import scala.util.chaining.scalaUtilChainingOps

// ---
// Constants
// ---

val DATA_DIR = "data"
val INPUT_DIR = "input"
val OUTPUT_DIR = "output"

// ---
// Main
// ---

@main
def run(): Unit = {
  val scenarios: List[(String, () => Unit)] = List(
    ("setup", setup),
    ("importAndExport", importAndExport),
    ("matMethods", matMethods),
    ("bands", bands),
    ("grayscale", grayscale),
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

def getInputFp(filename: String): Path = {
  Paths.get(DATA_DIR).resolve(INPUT_DIR).resolve(filename)
}

def getOutputFp(filename: String): Path = {
  Paths.get(DATA_DIR).resolve(OUTPUT_DIR).resolve(filename)
}

def readImage(path: Path): Try[Mat] = {
  val img = imread(path.toString)
  img.empty() match {
    case true  => Failure(RuntimeException(s"Could not open file ${path.toString}"))
    case false => Success(img)
  }
}

def readImageWithOptions(path: Path, flags: Int): Try[Mat] = {
  val img = imread(path.toString, flags)
  img.empty() match {
    case true  => Failure(RuntimeException(s"Could not open file ${path.toString}"))
    case false => Success(img)
  }
}

def writeImage(path: Path, image: Mat): Try[Unit] = {
  val success = imwrite(path.toString(), image)
  success match {
    case true  => Success(())
    case false => Failure(RuntimeException(s"Could not open file ${path.toString}"))
  }
}

// ---
// Examples
// ---

def setup(): Unit = {
  val dataDir = Paths.get(DATA_DIR)
  val inputDir = dataDir.resolve(INPUT_DIR)
  val outputDir = dataDir.resolve(OUTPUT_DIR)

  Files.createDirectories(inputDir)
  Files.createDirectories(outputDir)

  println("...")
}

def importAndExport(): Unit = {
  val filenames = List("polaris.jpg", "beach.jpg", "orchid.jpg", "tree.jpg")

  filenames.foreach(fn => {
    val inputFp = getInputFp(fn)
    val img = readImage(inputFp).get
    val outputFp = getOutputFp(fn)
    writeImage(outputFp, img)
  })

  println("...")
}

def matMethods(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get

  val results = List(
    s"img.depth: ${img.depth}",
    s"img.channels: ${img.channels}",
    s"img.size: ${img.size}",
    s"img.dims: ${img.dims}",
  )
  results.foreach(println)
}

def bands(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)

  {
    val src = readImage(inputFp).get
    val dst = new Mat()
    cvtColor(src, dst, COLOR_BGR2RGB)
    val outputFp = getOutputFp("polaris-bands-rgb.jpg")
    writeImage(outputFp, dst)
  }

  {
    val src = readImage(inputFp).get
    val dst = new Mat()
    cvtColor(src, dst, COLOR_BGR2HLS)
    val outputFp = getOutputFp("polaris-bands-hls.jpg")
    writeImage(outputFp, dst)
  }

  println("...")
}

def grayscale(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImageWithOptions(inputFp, IMREAD_GRAYSCALE).get
  val outputFp = getOutputFp("polaris-gray.jpg")
  writeImage(outputFp, img)

  println("...")
}
