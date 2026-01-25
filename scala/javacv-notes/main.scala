//> using scala 3.7.4

//> using dep "org.bytedeco:javacv-platform:1.5.12"

import org.bytedeco.opencv.global.opencv_core.BORDER_DEFAULT
import org.bytedeco.opencv.global.opencv_core.CV_64F
import org.bytedeco.opencv.global.opencv_core.CV_8U
import org.bytedeco.opencv.global.opencv_core.addWeighted
import org.bytedeco.opencv.global.opencv_core.convertScaleAbs
import org.bytedeco.opencv.global.opencv_core.flip
import org.bytedeco.opencv.global.opencv_core.multiply
import org.bytedeco.opencv.global.opencv_core.pow
import org.bytedeco.opencv.global.opencv_core.split
import org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_GRAYSCALE
import org.bytedeco.opencv.global.opencv_imgcodecs.imread
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite
import org.bytedeco.opencv.global.opencv_imgproc.ADAPTIVE_THRESH_GAUSSIAN_C
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2HLS
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2HSV
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2RGB
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_HSV2BGR
import org.bytedeco.opencv.global.opencv_imgproc.GaussianBlur
import org.bytedeco.opencv.global.opencv_imgproc.INTER_AREA
import org.bytedeco.opencv.global.opencv_imgproc.Laplacian
import org.bytedeco.opencv.global.opencv_imgproc.MORPH_CLOSE
import org.bytedeco.opencv.global.opencv_imgproc.MORPH_GRADIENT
import org.bytedeco.opencv.global.opencv_imgproc.MORPH_OPEN
import org.bytedeco.opencv.global.opencv_imgproc.Sobel
import org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY
import org.bytedeco.opencv.global.opencv_imgproc.adaptiveThreshold
import org.bytedeco.opencv.global.opencv_imgproc.cvtColor
import org.bytedeco.opencv.global.opencv_imgproc.dilate
import org.bytedeco.opencv.global.opencv_imgproc.equalizeHist
import org.bytedeco.opencv.global.opencv_imgproc.erode
import org.bytedeco.opencv.global.opencv_imgproc.morphologyEx
import org.bytedeco.opencv.global.opencv_imgproc.resize
import org.bytedeco.opencv.global.opencv_imgproc.threshold
import org.bytedeco.opencv.global.opencv_photo.fastNlMeansDenoisingColored
import org.bytedeco.opencv.opencv_core.Mat
import org.bytedeco.opencv.opencv_core.MatVector
import org.bytedeco.opencv.opencv_core.Scalar
import org.bytedeco.opencv.opencv_core.Size
import org.bytedeco.opencv.opencv_dnn_superres.DnnSuperResImpl

import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
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
    ("resizing", resizing),
    ("rotation", rotation),
    ("flipping", flipping),
    ("brightening", brightening),
    ("adjustingContrast", adjustingContrast),
    ("thresholding", thresholding),
    ("gammaCorrection", gammaCorrection),
    ("blurring", blurring),
    ("morphologicalOperators", morphologicalOperators),
    ("gradients", gradients),
    ("histogramEqualization", histogramEqualization),
    ("cornerDetection", cornerDetection),
    ("cannyEdgeDetector", cannyEdgeDetector),
    ("featureDetection", featureDetection),
    ("featureMatching", featureMatching),
    ("upscaling", upscaling),
    ("denoising", denoising),
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

def imgPow(img: Mat, value: Float): Mat = {
  val dst = new Mat()
  pow(img, value, dst)
  dst
}

def imgMul(img: Mat, value: Float): Mat = {
  val dst = multiply(img, value).asMat()
  dst
}

def imgDiv(img: Mat, value: Float): Mat = {
  val inverted = 1.0 / value
  val dst = multiply(img, inverted).asMat()
  dst
}

def convertTo(img: Mat, rtype: Int): Mat = {
  img.clone().convertTo(img, CV_64F)
  img
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
    writeImage(outputFp, img).get
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
    writeImage(outputFp, dst).get
  }

  {
    val src = readImage(inputFp).get
    val dst = new Mat()
    cvtColor(src, dst, COLOR_BGR2HLS)
    val outputFp = getOutputFp("polaris-bands-hls.jpg")
    writeImage(outputFp, dst).get
  }

  println("...")
}

def grayscale(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImageWithOptions(inputFp, IMREAD_GRAYSCALE).get
  val outputFp = getOutputFp("polaris-gray.jpg")
  writeImage(outputFp, img).get

  println("...")
}

def resizing(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get

  // Static size
  {
    val dst = new Mat()
    val size = new Size(500, 500)
    resize(img, dst, size)
    val outputFp = getOutputFp("polaris-resize-static.jpg")
    writeImage(outputFp, dst).get
  }
  // Computed size
  {
    val dst = new Mat()
    val size = new Size(0, 0)
    resize(img, dst, size, 0.5, 0.5, INTER_AREA)
    val outputFp = getOutputFp("polaris-resize-computed.jpg")
    writeImage(outputFp, dst).get
  }

  println("...")
}

def rotation(): Unit = {
  println("...")
}

def flipping(): Unit = {
  val filename = "polaris.jpg";
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()
  flip(img, dst, 0)
  val outputFp = getOutputFp("polaris-flipped.jpg")
  writeImage(outputFp, dst)

  println("...")
}

def brightening(): Unit = {
  val filename = "polaris.jpg";
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()
  convertScaleAbs(img, dst, 1.05, 10.0)
  val outputFp = getOutputFp("polaris-brighten.jpg")
  writeImage(outputFp, dst)

  println("...")
}

def adjustContrast(
    img: Mat,
    contrast: Float, // 0.0 to 1.0
    brightness: Int, // -255 to 255
): Mat = {
  val gamma = brightness + (255.0 * (1.0 - contrast) / 2.0)
  val dst = new Mat()
  addWeighted(img, contrast, img, 0.0, gamma, dst, -1)
  dst
}

def adjustingContrast(): Unit = {
  val filename = "polaris.jpg";
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = adjustContrast(img, 1.3, 0)
  val outputFp = getOutputFp("polaris-contrast.jpg")
  writeImage(outputFp, dst).get

  println("...")
}

def thresholding(): Unit = {
  val filename = "orchid.jpg"
  val inputFp = getInputFp(filename)
  val img = readImageWithOptions(inputFp, IMREAD_GRAYSCALE).get

  // Binary threshold
  {
    val src = img.clone()
    threshold(src, src, 100.0, 255.0, THRESH_BINARY)
    val outputFp = getOutputFp("polaris-threshold.jpg")
    writeImage(outputFp, src).get
  }

  // Adaptive threshold
  {
    val src = img.clone()
    val method = ADAPTIVE_THRESH_GAUSSIAN_C
    adaptiveThreshold(src, src, 255.0, method, THRESH_BINARY, 11, 2.0)
    val outputFp = getOutputFp("polaris-threshold-adaptive.jpg")
    writeImage(outputFp, img).get
  }

  println("...")
}

def gamma_correct(img: Mat, gamma: Float): Mat = {
  // brighter: `0 < γ < 1`
  // darker: `γ > 1`
  img
    .pipe(m => convertTo(m, CV_64F))
    .pipe(m => imgDiv(m, 255.0))
    .pipe(m => imgPow(m, gamma))
    .pipe(m => imgMul(m, 255.0))
    .pipe(m => convertTo(m, CV_8U))
}

def gammaCorrection(): Unit = {
  val filename = "orchid.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val gamma = 3.0 / 4.0
  val dst = gamma_correct(img, gamma.toFloat)
  val outputFp = getOutputFp("orchid-gamma.jpg")
  writeImage(outputFp, dst).get

  println("...")
}

def blurring(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()
  GaussianBlur(img, dst, Size(3, 3), 1.0)
  val outputFp = getOutputFp("polaris-blur-gaussian.jpg")
  writeImage(outputFp, dst).get

  println("...")
}

def morphologicalOperators(): Unit = {
  val filename = "beach.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get

  // Erode (decrease white area)
  {
    val src = img.clone()
    val dst = new Mat()
    val erodeKernel = Mat.ones(5, 5, CV_8U).asMat()
    erode(src, dst, erodeKernel)
    val output_fp = getOutputFp("beach-erode.jpg")
    writeImage(output_fp, dst).get
  }

  // Dilate (increase white area)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    dilate(src, dst, kernel)
    val output_fp = getOutputFp("beach-dilate.jpg");
    writeImage(output_fp, dst).get
  }

  // Opening (erode, then dilate) (remove white noise)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    morphologyEx(src, dst, MORPH_OPEN, kernel)
    val output_fp = getOutputFp("beach-open.jpg");
    writeImage(output_fp, dst).get
  }

  // Closing (dilate, then erode) (remove black noise)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    morphologyEx(src, dst, MORPH_CLOSE, kernel)
    val output_fp = getOutputFp("beach-close.jpg");
    writeImage(output_fp, dst).get
  }

  // Morphological Gradient (dilation - erosion)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    morphologyEx(src, dst, MORPH_GRADIENT, kernel)
    val output_fp = getOutputFp("beach-gradient.jpg");
    writeImage(output_fp, dst).get
  }

  println("...")
}

def gradients(): Unit = {
  val filename = "polaris.jpg"
  val input_fp = getInputFp(filename)
  val img = readImageWithOptions(input_fp, IMREAD_GRAYSCALE).get

  // Sobel X
  {
    val src = img.clone()
    val dst = new Mat()
    Sobel(src, dst, CV_64F, 1, 0)
    val output_fp = getOutputFp("polaris-gradients-sobel-x.jpg")
    writeImage(output_fp, dst)
  }

  // Sobel Y
  {
    val src = img.clone()
    val dst = new Mat()
    Sobel(src, dst, CV_64F, 0, 1)
    val output_fp = getOutputFp("polaris-gradients-sobel-y.jpg")
    writeImage(output_fp, dst)
  }

  // Laplacian
  {
    val src = img.clone()
    val dst = new Mat()
    Laplacian(src, dst, CV_64F, 5, 1.0, 0.0, BORDER_DEFAULT)
    val output_fp = getOutputFp("polaris-gradients-laplacian.jpg")
    writeImage(output_fp, dst)
  }

  println("...")
}

def equalizeHistogram(img: Mat): Mat = {
  val dst = new Mat()
  cvtColor(img, dst, COLOR_BGR2HSV)
  val channels = new MatVector()
  split(img, channels)
  val channel = channels.get(2)
  equalizeHist(channel, channel)
  channels.put(2, channel)
  cvtColor(dst, dst, COLOR_HSV2BGR)
  dst
}

def histogramEqualization(): Unit = {
  val filename = "beach.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = equalizeHistogram(img);
  val output_fp = getOutputFp("beach-histogram-equalization-color.jpg");
  writeImage(output_fp, dst).get

  println("...")
}

def cornerDetection(): Unit = {
  println("...")
}

def cannyEdgeDetector(): Unit = {
  println("...")
}

def featureDetection(): Unit = {
  println("...")
}

def featureMatching(): Unit = {
  println("...")
}

def getSuperres(): DnnSuperResImpl = {
  val sr = new DnnSuperResImpl()
  val modelPath = Paths.get("models").resolve("FSRCNN_x2.pb")
  sr.readModel(modelPath.toString)
  sr.setModel("fsrcnn", 2)
  sr
}

def upscaling(): Unit = {
  val filename = "polaris.jpg"
  val input_fp = getInputFp(filename)
  val img = readImage(input_fp).get

  val sr = getSuperres()
  val dst = new Mat()
  sr.upsample(img, dst)
  val output_fp = getOutputFp("polaris-upscaled.jpg")
  writeImage(output_fp, dst).get

  println("...")
}

def denoising(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()

  fastNlMeansDenoisingColored(img, dst, 5.0f, 5.0f, 5, 5)
  val outputFp = getOutputFp("polaris-denoised.jpg")
  writeImage(outputFp, dst).get

  println("...")
}
