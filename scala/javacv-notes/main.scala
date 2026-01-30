//> using scala 3.7.4

//> using dep "org.bytedeco:javacv-platform:1.5.12"

import org.bytedeco.javacpp.DoublePointer
import org.bytedeco.javacpp.indexer.FloatArrayIndexer
import org.bytedeco.javacpp.indexer.FloatIndexer
import org.bytedeco.javacpp.indexer.UByteIndexer
import org.bytedeco.opencv.global.opencv_core.BORDER_DEFAULT
import org.bytedeco.opencv.global.opencv_core.CV_32F
import org.bytedeco.opencv.global.opencv_core.CV_64F
import org.bytedeco.opencv.global.opencv_core.CV_8U
import org.bytedeco.opencv.global.opencv_core.NORM_MINMAX
import org.bytedeco.opencv.global.opencv_core.SORT_ASCENDING
import org.bytedeco.opencv.global.opencv_core.addWeighted
import org.bytedeco.opencv.global.opencv_core.convertScaleAbs
import org.bytedeco.opencv.global.opencv_core.flip
import org.bytedeco.opencv.global.opencv_core.minMaxLoc
import org.bytedeco.opencv.global.opencv_core.multiply
import org.bytedeco.opencv.global.opencv_core.noArray
import org.bytedeco.opencv.global.opencv_core.normalize
import org.bytedeco.opencv.global.opencv_core.pow
import org.bytedeco.opencv.global.opencv_core.sort
import org.bytedeco.opencv.global.opencv_core.split
import org.bytedeco.opencv.global.opencv_features2d
import org.bytedeco.opencv.global.opencv_features2d.DEFAULT as DrawMatchesFlagsDefault
import org.bytedeco.opencv.global.opencv_features2d.drawKeypoints
import org.bytedeco.opencv.global.opencv_imgcodecs.IMREAD_GRAYSCALE
import org.bytedeco.opencv.global.opencv_imgcodecs.imread
import org.bytedeco.opencv.global.opencv_imgcodecs.imwrite
import org.bytedeco.opencv.global.opencv_imgproc.ADAPTIVE_THRESH_GAUSSIAN_C
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2GRAY
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2HLS
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2HSV
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_BGR2RGB
import org.bytedeco.opencv.global.opencv_imgproc.COLOR_HSV2BGR
import org.bytedeco.opencv.global.opencv_imgproc.Canny
import org.bytedeco.opencv.global.opencv_imgproc.GaussianBlur
import org.bytedeco.opencv.global.opencv_imgproc.INTER_AREA
import org.bytedeco.opencv.global.opencv_imgproc.Laplacian
import org.bytedeco.opencv.global.opencv_imgproc.MORPH_CLOSE
import org.bytedeco.opencv.global.opencv_imgproc.MORPH_GRADIENT
import org.bytedeco.opencv.global.opencv_imgproc.MORPH_OPEN
import org.bytedeco.opencv.global.opencv_imgproc.Sobel
import org.bytedeco.opencv.global.opencv_imgproc.THRESH_BINARY
import org.bytedeco.opencv.global.opencv_imgproc.adaptiveThreshold
import org.bytedeco.opencv.global.opencv_imgproc.cornerHarris
import org.bytedeco.opencv.global.opencv_imgproc.cvtColor
import org.bytedeco.opencv.global.opencv_imgproc.dilate
import org.bytedeco.opencv.global.opencv_imgproc.equalizeHist
import org.bytedeco.opencv.global.opencv_imgproc.erode
import org.bytedeco.opencv.global.opencv_imgproc.morphologyEx
import org.bytedeco.opencv.global.opencv_imgproc.resize
import org.bytedeco.opencv.global.opencv_imgproc.threshold
import org.bytedeco.opencv.global.opencv_photo.fastNlMeansDenoisingColored
import org.bytedeco.opencv.opencv_core.KeyPointVector
import org.bytedeco.opencv.opencv_core.Mat
import org.bytedeco.opencv.opencv_core.MatVector
import org.bytedeco.opencv.opencv_core.Scalar
import org.bytedeco.opencv.opencv_core.Size
import org.bytedeco.opencv.opencv_dnn_superres.DnnSuperResImpl
import org.bytedeco.opencv.opencv_features2d.AKAZE
import org.bytedeco.opencv.opencv_features2d.KAZE
import org.bytedeco.opencv.opencv_features2d.ORB
import org.opencv.core.Core.MinMaxLocResult

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
    ("import-and-export", importAndExport),
    ("mat-methods", matMethods),
    ("bands", bands),
    ("grayscale", grayscale),
    ("resizing", resizing),
    ("rotation", rotation),
    ("flipping", flipping),
    ("brightening", brightening),
    ("adjusting-contrast", adjustingContrast),
    ("thresholding", thresholding),
    ("gamma-correction", gammaCorrection),
    ("blurring", blurring),
    ("morphological-operators", morphologicalOperators),
    ("gradients", gradients),
    ("histogram-equalization", histogramEqualization),
    ("corner-detection", cornerDetection),
    ("canny-edge-detector", cannyEdgeDetector),
    ("feature-detection", featureDetection),
    ("feature-matching", featureMatching),
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
  val dst = new Mat()
  img.convertTo(dst, rtype)
  dst
}

def convertColor(img: Mat, code: Int): Mat = {
  val dst = new Mat()
  cvtColor(img, dst, code)
  dst
}

def imgMedian(mat: Mat): Double = {
  val mat64 = convertTo(mat, CV_64F)
  val flat = mat64.reshape(1, 1) // 1 row, N columns
  val sorted = new Mat()
  sort(flat, sorted, SORT_ASCENDING)
  val n = sorted.cols()
  // Get median
  if (n % 2 == 1) {
    sorted.ptr(0, n / 2).getDouble()
  } else {
    val a = sorted.ptr(0, n / 2 - 1).getDouble()
    val b = sorted.ptr(0, n / 2).getDouble()
    (a + b) / 2.0
  }
}

def clamp(value: Double, lower: Double, upper: Double): Double = {
  math.max(lower, math.min(value, upper))
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
}

def importAndExport(): Unit = {
  val filenames = List("polaris.jpg", "beach.jpg", "orchid.jpg", "tree.jpg")

  filenames.foreach(fn => {
    val inputFp = getInputFp(fn)
    val img = readImage(inputFp).get
    val outputFp = getOutputFp(fn)
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, img).get
  })
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
    val dst = convertColor(src, COLOR_BGR2RGB)
    val outputFp = getOutputFp("polaris-bands-rgb.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  {
    val src = readImage(inputFp).get
    val dst = convertColor(src, COLOR_BGR2HLS)
    val outputFp = getOutputFp("polaris-bands-hls.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
}

def grayscale(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImageWithOptions(inputFp, IMREAD_GRAYSCALE).get
  val outputFp = getOutputFp("polaris-gray.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, img).get
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
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
  // Computed size
  {
    val dst = new Mat()
    val size = new Size(0, 0)
    resize(img, dst, size, 0.5, 0.5, INTER_AREA)
    val outputFp = getOutputFp("polaris-resize-computed.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
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
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst)
}

def brightening(): Unit = {
  val filename = "polaris.jpg";
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()
  convertScaleAbs(img, dst, 1.05, 10.0)
  val outputFp = getOutputFp("polaris-brighten.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst)
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
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst).get
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
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, src).get
  }

  // Adaptive threshold
  {
    val src = img.clone()
    val method = ADAPTIVE_THRESH_GAUSSIAN_C
    adaptiveThreshold(src, src, 255.0, method, THRESH_BINARY, 11, 2.0)
    val outputFp = getOutputFp("polaris-threshold-adaptive.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, img).get
  }
}

def gammaCorrect(img: Mat, gamma: Float): Mat = {
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
  val dst = gammaCorrect(img, gamma.toFloat)
  val outputFp = getOutputFp("orchid-gamma.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst).get
}

def blurring(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()
  GaussianBlur(img, dst, Size(3, 3), 1.0)
  val outputFp = getOutputFp("polaris-blur-gaussian.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst).get
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
    val outputFp = getOutputFp("beach-erode.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Dilate (increase white area)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    dilate(src, dst, kernel)
    val outputFp = getOutputFp("beach-dilate.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Opening (erode, then dilate) (remove white noise)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    morphologyEx(src, dst, MORPH_OPEN, kernel)
    val outputFp = getOutputFp("beach-open.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Closing (dilate, then erode) (remove black noise)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    morphologyEx(src, dst, MORPH_CLOSE, kernel)
    val outputFp = getOutputFp("beach-close.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Morphological Gradient (dilation - erosion)
  {
    val src = img.clone()
    val dst = new Mat()
    val kernel = Mat.ones(5, 5, CV_8U).asMat()
    morphologyEx(src, dst, MORPH_GRADIENT, kernel)
    val outputFp = getOutputFp("beach-gradient.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
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
    val outputFp = getOutputFp("polaris-gradients-sobel-x.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Sobel Y
  {
    val src = img.clone()
    val dst = new Mat()
    Sobel(src, dst, CV_64F, 0, 1)
    val outputFp = getOutputFp("polaris-gradients-sobel-y.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Laplacian
  {
    val src = img.clone()
    val dst = new Mat()
    Laplacian(src, dst, CV_64F, 5, 1.0, 0.0, BORDER_DEFAULT)
    val outputFp = getOutputFp("polaris-gradients-laplacian.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
}

def equalizeHistogram(img: Mat): Mat = {
  val imgHsv = convertColor(img, COLOR_BGR2HSV)
  val channels = new MatVector()
  split(imgHsv, channels)
  val channel = channels.get(2)
  equalizeHist(channel.clone(), channel)
  channels.put(2, channel)
  val dst = convertColor(imgHsv, COLOR_HSV2BGR)
  dst
}

def histogramEqualization(): Unit = {
  val filename = "beach.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = equalizeHistogram(img)
  val outputFp = getOutputFp("beach-histogram-equalization-color.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst).get
}

def cornerDetection(): Unit = {
  val filename = "tree.jpg"
  val input_fp = getInputFp(filename)
  val img = readImage(input_fp).get

  // Read grayscale
  val imgGray = {
    val src = img.clone()
    val dst = convertColor(src, COLOR_BGR2GRAY)
    val outputFp = getOutputFp("tree-gray.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
    dst
  }

  val imgCorners = {
    val src = imgGray.clone()
    var dst = convertTo(src, CV_32F)
    cornerHarris(dst.clone(), dst, 2, 3, 0.04)
    val dilateKernel = Mat.ones(5, 5, CV_8U).asMat()
    dilate(dst.clone(), dst, dilateKernel)
    normalize(dst.clone(), dst, 0.0, 255.0, NORM_MINMAX, -1, noArray())
    // Threshold at 15
    threshold(dst.clone(), dst, 15.0, 255.0, THRESH_BINARY)
    dst = convertTo(dst, CV_8U)
    val outputFp = getOutputFp("tree-corners-harris.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
    dst
  }

  {
    val src = img.clone()
    val size = img.size()
    val (height, width) = (size.height(), size.width())

    val threshold = {
      val minPtr = new DoublePointer(1)
      val maxPtr = new DoublePointer(1)
      minMaxLoc(imgCorners, minPtr, maxPtr, null, null, null)
      val maxVal = maxPtr.get()
      maxVal * 0.01
    }

    for {
      y <- 0 until height
      x <- 0 until width
    } {
      // byte -> unsigned int (`... & 0xff`)
      val cornerValue = imgCorners.ptr(y, x).get() & 0xff
      val is_corner = cornerValue > threshold;
      if (is_corner) {
        val pixel = src.ptr(y, x)
        pixel.put(0.toByte) // B
        pixel.put(1, 255.toByte) // G
        pixel.put(2, 0.toByte) // R
      }
    }

    val outputFp = getOutputFp("tree-corners-harris-highlighted.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, src).get
  }
}

def cannyEdgeDetector(): Unit = {
  // intensity gradient < threshold1 -- not an edge
  // intensity gradient > threshold2 -- edge
  // intensity gradient between thresholds -- possibly (if connected to an edge pixel)

  val filename = "tree.jpg"
  val input_fp = getInputFp(filename)
  val img = {
    val src = readImage(input_fp).get
    val dst = new Mat()
    GaussianBlur(src, dst, Size(5, 5), 10.0)
    dst
  }

  // Manual thresholds
  {
    val src = img.clone()
    val dst = new Mat()
    Canny(src, dst, 100.0, 150.0)
    val outputFp = getOutputFp("tree-canny-edge-detector.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Median-based thresholds
  {
    val src = img.clone()
    val dst = new Mat()
    val (thresh1, thresh2) = {
      val median = imgMedian(src)
      val getThreshold = (scalar: Double) => {
        median
          .pipe(m => math.max(0.0, m * scalar))
          .pipe(m => clamp(m, 0.0, 255.0))
      }
      val thresh1 = getThreshold(0.8)
      val thresh2 = getThreshold(1.2)
      (thresh1, thresh2)
    }
    Canny(src, dst, thresh1, thresh2)
    val outputFp = getOutputFp("tree-canny-edge-detector-2.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
}

def featureDetection(): Unit = {
  val filename = "tree.jpg"
  val input_fp = getInputFp(filename)
  val img = {
    val src = readImage(input_fp).get
    val dst = new Mat()
    GaussianBlur(src, dst, Size(5, 5), 10.0)
    dst
  }

  // Orb Harris corner
  {
    val src = img.clone()
    val dst = new Mat()
    val orb = ORB.create(
      5000, // nFeatures
      1.2f, // scaleFactor
      8, // nLevels
      15, // edgeThreshold
      0, // firstLevel
      2, // WTA_K
      ORB.HARRIS_SCORE, // scoreType
      31, // patchSize
      20, // fastThreshold
    )
    val mask = new Mat()
    val keyPoints = new KeyPointVector()
    val descriptors = new Mat()
    orb.detectAndCompute(src, mask, keyPoints, descriptors)
    drawKeypoints(src, keyPoints, dst, Scalar(0, 255, 0, 0), DrawMatchesFlagsDefault)
    val outputFp = getOutputFp("tree-feature-detection-orb-harris-corner.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Kaze Blob
  {
    val src = img.clone()
    val dst = new Mat()
    val kaze = KAZE.create()
    val mask = new Mat()
    val keyPoints = new KeyPointVector()
    val descriptors = new Mat()
    kaze.detectAndCompute(src, mask, keyPoints, descriptors)
    drawKeypoints(src, keyPoints, dst, Scalar(0, 255, 0, 0), DrawMatchesFlagsDefault)
    val outputFp = getOutputFp("tree-feature-detection-kaze-blob.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }

  // Akaze Blob
  {
    val src = img.clone()
    val dst = new Mat()
    val akaze = AKAZE.create()
    val mask = new Mat()
    val keyPoints = new KeyPointVector()
    val descriptors = new Mat()
    akaze.detectAndCompute(src, mask, keyPoints, descriptors)
    drawKeypoints(src, keyPoints, dst, Scalar(0, 255, 0, 0), DrawMatchesFlagsDefault)
    val outputFp = getOutputFp("tree-feature-detection-akaze-blob.jpg")
    println(s"Writing file ${outputFp}")
    writeImage(outputFp, dst).get
  }
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
  val outputFp = getOutputFp("polaris-upscaled.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst).get
}

def denoising(): Unit = {
  val filename = "polaris.jpg"
  val inputFp = getInputFp(filename)
  val img = readImage(inputFp).get
  val dst = new Mat()

  fastNlMeansDenoisingColored(img, dst, 5.0f, 5.0f, 5, 5)
  val outputFp = getOutputFp("polaris-denoised.jpg")
  println(s"Writing file ${outputFp}")
  writeImage(outputFp, dst).get
}
