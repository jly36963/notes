#r @"nuget: OpenCvSharp4"
#r @"nuget: OpenCvSharp4.runtime.osx.10.15-x64"

open OpenCvSharp
open OpenCvSharp.DnnSuperres
open System.IO

// ---
// Constants
// ---

let DATA_DIR = "data"
let INPUT_DIR = "input"
let OUTPUT_DIR = "output"
let MODELS_DIR = "models"

// ---
// Utils
// ---

/// Convert a title to upper-case, wrap with new lines, then print
let printSectionTitle (title: string) : unit =
    System.Console.WriteLine $"\n{title.ToUpper()}\n"

/// Get the type name of a value
let getTypeName v : obj =
    if v = null then "<null>" else v.GetType().Name

/// Text format a (potentially-boxed) value
let pretty value =
    match tryUnbox value with
    | Some unboxed -> sprintf "%A" unboxed
    | None -> sprintf "%A" value

let printResults (results: (string * obj) list) : unit =
    for k, v in results do
        let typeName = getTypeName v
        let value = pretty v
        System.Console.WriteLine $"{k}\n{typeName}\n{value}\n"

let getInputFp filename =
    Path.Join [| DATA_DIR; INPUT_DIR; filename |]

let getOutputFp filename =
    Path.Join [| DATA_DIR; OUTPUT_DIR; filename |]

// ---
// Examples
// ---

let setup () =
    let dirs =
        [
            DATA_DIR
            Path.Combine(DATA_DIR, INPUT_DIR)
            Path.Combine(DATA_DIR, OUTPUT_DIR)
        ]

    for dirPath in dirs do
        dirPath |> Directory.CreateDirectory |> ignore

let basicImportExport () =
    let filenames = [| "polaris.jpg"; "beach.jpg"; "orchid.jpg"; "tree.jpg" |]

    for name in filenames do
        let inputFp = getInputFp name
        let outputFp = getOutputFp name
        printfn $"Copying {inputFp} to {outputFp}"
        use img = Cv2.ImRead inputFp
        Cv2.ImWrite(outputFp, img) |> ignore

let basicMatMethods () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use img = Cv2.ImRead inputFp

    let results: (string * obj) list =
        [
            "img.Type()", img.Type()
            "img.Depth()", img.Depth()
            "img.Channels()", img.Channels()
            "img.Size()", img.Size()
            "img.Dims", img.Dims
        ]

    printResults results

let basicBands () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use img = Cv2.ImRead inputFp

    (fun () ->
        use imgDst = new Mat()
        Cv2.CvtColor(img, imgDst, ColorConversionCodes.BGR2RGB)
        let outputFp = getOutputFp "polaris-bands-rgb.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    (fun () ->
        use imgDst = new Mat()
        Cv2.CvtColor(img, imgDst, ColorConversionCodes.RGB2HLS)
        let outputFp = getOutputFp "polaris-bands-hls.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()


let basicGrayscale () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use img = Cv2.ImRead(inputFp, ?flags = Some ImreadModes.Grayscale)
    let outputFp = getOutputFp "polaris-gray.jpg"
    Cv2.ImWrite(outputFp, img) |> ignore


let basicResizing () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use img = Cv2.ImRead inputFp

    // Known size
    (fun () ->
        use imgDst = new Mat()
        Cv2.Resize(img, imgDst, Size(500, 500))
        let outputFp = getOutputFp "polaris-resize-1.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Dynamically-computed size
    (fun () ->
        use img2 = new Mat()
        let scale = Some 0.5
        let inter = Some InterpolationFlags.Area
        Cv2.Resize(img, img2, Size(0, 0), ?fx = scale, ?fy = scale, ?interpolation = inter)
        let outputFp2 = getOutputFp "polaris-resize-2.jpg"
        Cv2.ImWrite(outputFp2, img2) |> ignore) ()

let addPadding (img: Mat) =
    let target = new Mat()
    let size = img.Size()
    let h, w = size.Height, size.Width
    let px, py = h / 2, w / 2
    Cv2.CopyMakeBorder(img, target, py, py, px, px, BorderTypes.Constant)
    target

let rotateByAngle (angle: float) (scale: float) (img: Mat) =
    let target = new Mat()
    let size = img.Size()
    let h, w = float32 size.Height, float32 size.Width
    let center = Point2f(h / 2.0f, w / 2.0f)
    let rm = Cv2.GetRotationMatrix2D(center, angle, scale)
    Cv2.WarpAffine(img, target, rm, Size(float h, float w))
    target

let basicRotation () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp

    // Simple angles (multiples of 90)
    (fun () ->
        use imgDst = new Mat()
        Cv2.Rotate(imgSrc, imgDst, RotateFlags.Rotate180)
        let outputFp = getOutputFp "polaris-rotate-1.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Other angles
    (fun () ->
        use imgDst = imgSrc |> addPadding |> rotateByAngle 45.0 1.0
        let outputFp = getOutputFp "polaris-rotate-2.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

let basicFlipping () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp
    use imgDst = new Mat()
    Cv2.Flip(imgSrc, imgDst, FlipMode.X)
    let output_fp = getOutputFp "polaris-flip.jpg"
    Cv2.ImWrite(output_fp, imgDst) |> ignore

let basicBrightening () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp
    use imgDst = new Mat()
    Cv2.ConvertScaleAbs(imgSrc, imgDst, 1.05, 10.0)
    let output_fp = getOutputFp "polaris-brighten.jpg"
    Cv2.ImWrite(output_fp, imgDst) |> ignore


let adjustContrast (contrast: float) (brightness: int8) (img: Mat) =
    let gamma = float brightness + 255.0 * (1.0 - contrast) / 2.0
    let imgDst = new Mat()
    Cv2.AddWeighted(img, contrast, img, 0.0, gamma, imgDst, -1)
    imgDst

let basicContrast () =
    let filename = "tmbte.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp
    use imgDst = adjustContrast 1.3 (int8 0) imgSrc
    let output_fp = getOutputFp "tmbte-contrast.jpg"
    Cv2.ImWrite(output_fp, imgDst) |> ignore


let basicThresholding () =
    let filename = "tmbte.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead(inputFp, ?flags = Some ImreadModes.Grayscale)

    let bin_thresh = ThresholdTypes.Binary
    let gaussian = AdaptiveThresholdTypes.GaussianC

    (fun () ->
        use imgDst = new Mat()
        Cv2.Threshold(imgSrc, imgDst, 100.0, 255.0, bin_thresh) |> ignore
        let outputFp = getOutputFp "tmbte-threshold.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    (fun () ->
        use imgDst = new Mat()
        Cv2.AdaptiveThreshold(imgSrc, imgDst, 255.0, gaussian, bin_thresh, 11, 2.0)
        let outputFp = getOutputFp "tmbte-threshold-adaptive.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

let gammaCorrect (gamma: float) (img: Mat) =
    // brighter: `0 < γ < 1`; darker: `γ > 1`
    let imgF64 = new Mat()
    img.ConvertTo(imgF64, MatType.CV_64F)
    // Must be CV_64F (instead of integer-based)
    let imgDst: Mat = imgF64.Divide(255.0).ToMat().Pow(gamma).Multiply(255.0).ToMat()
    imgDst.ConvertTo(imgDst, MatType.CV_8U)
    imgDst


let basicGammaCorrection () =
    let filename = "orchid.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp
    let gamma = 3.0 / 4.0
    use imgDst = gammaCorrect gamma imgSrc
    let outputFp = getOutputFp "orchid-gamma.jpg"
    Cv2.ImWrite(outputFp, imgDst) |> ignore

let basicBlurring () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp
    use imgDst = new Mat()
    Cv2.GaussianBlur(imgSrc, imgDst, Size(3, 3), 10.0)
    let outputFp = getOutputFp "polaris-blur-gaussian.jpg"
    Cv2.ImWrite(outputFp, imgDst) |> ignore


let basicMorphologicalOperators () =
    let filename = "beach.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp

    // Erode (decrease white area)
    (fun () ->
        let imgDst = new Mat()
        use erodeKernel = Mat.Ones(MatType.CV_8U, [| 5; 5 |]).ToMat()
        Cv2.Erode(imgSrc, imgDst, erodeKernel)
        let outputFp = getOutputFp "beach-erode.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Dilate (increase white area)
    (fun () ->
        use imgDst = new Mat()
        use dilateKernel = Mat.Ones(MatType.CV_8U, [| 5; 5 |]).ToMat()
        Cv2.Dilate(imgSrc, imgDst, dilateKernel)
        let outputFp = getOutputFp "beach-dilate.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Opening (erode, then dilate) (remove white noise)
    (fun () ->
        use imgDst = new Mat()
        use openingKernel = Mat.Ones(MatType.CV_8U, [| 5; 5 |]).ToMat()
        Cv2.MorphologyEx(imgSrc, imgDst, MorphTypes.Open, openingKernel)
        let outputFp = getOutputFp "beach-open.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Closing (dilate, then erode) (remove black noise)
    (fun () ->
        use imgDst = new Mat()
        use closingKernel = Mat.Ones(MatType.CV_8U, [| 5; 5 |]).ToMat()
        Cv2.MorphologyEx(imgSrc, imgDst, MorphTypes.Close, closingKernel)
        let outputFp = getOutputFp "beach-close.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Morphological Gradient (dilation - erosion)
    (fun () ->
        use imgDst = new Mat()
        let gradientKernel = Mat.Ones(MatType.CV_8U, [| 5; 5 |]).ToMat()
        Cv2.MorphologyEx(imgSrc, imgDst, MorphTypes.Gradient, gradientKernel)
        let outputFp = getOutputFp "beach-gradient.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()


let basicGradients () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp

    // Sobel X
    (fun () ->
        use imgDst = new Mat()
        Cv2.Sobel(imgSrc, imgDst, MatType.CV_64F, 1, 0)
        let outputFp = getOutputFp "polaris-gradients-sobel-x.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Sobel Y
    (fun () ->
        use imgDst = new Mat()
        Cv2.Sobel(imgSrc, imgDst, MatType.CV_64F, 0, 1)
        let outputFp = getOutputFp "polaris-gradients-sobel-y.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()

    // Laplacian
    (fun () ->
        use imgDst = new Mat()
        Cv2.Laplacian(imgSrc, imgDst, MatType.CV_64F, 5, 1.0, 0.0, BorderTypes.Default)
        let outputFp = getOutputFp "polaris-gradients-laplacian.jpg"
        Cv2.ImWrite(outputFp, imgDst) |> ignore) ()


let equalizeHistogram (imgSrc: Mat) =
    let imgHsv = new Mat()
    Cv2.CvtColor(imgSrc, imgHsv, ColorConversionCodes.BGR2HSV)
    let channels = Cv2.Split imgHsv
    let channel = channels.[2]
    let channelDst = new Mat()
    Cv2.EqualizeHist(channel, channelDst)
    channels.[2] <- channel
    let merged = new Mat()
    Cv2.Merge(channels, merged)
    let imgDst = new Mat()
    Cv2.CvtColor(merged, imgDst, ColorConversionCodes.HSV2BGR)
    imgDst



let basicHistogramEqualization () =
    "beach.jpg"
    |> getInputFp
    |> Cv2.ImRead
    |> equalizeHistogram
    |> fun img -> Cv2.ImWrite(getOutputFp "beach-histogram-equalization-color.jpg", img)
    |> ignore



// TODO:
// corner detection
// canny edge detection
// feature detection


let setUpSuperres () =
    let sr = new DnnSuperResImpl()
    let model_path = Path.Combine [| MODELS_DIR; "FSRCNN_x2.pb" |]
    sr.ReadModel model_path
    sr.SetModel("fsrcnn", 2)
    sr

let basicUpscaling () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp

    use sr = setUpSuperres ()
    use imgDst = new Mat()
    sr.Upsample(imgSrc, imgDst)
    let outputFp = getOutputFp "polaris-upscaled.jpg"
    Cv2.ImWrite(outputFp, imgDst) |> ignore

let basicDenoising () =
    let filename = "polaris.jpg"
    let inputFp = getInputFp filename
    use imgSrc = Cv2.ImRead inputFp

    use imgDst = new Mat()
    Cv2.FastNlMeansDenoisingColored(imgSrc, imgDst, float32 5.0, float32 5.0, 5, 5)
    let outputFp = getOutputFp "polaris-denoised.jpg"
    Cv2.ImWrite(outputFp, imgDst) |> ignore

// ---
// Main
// ---

let main () =
    let examples: (string * (unit -> unit)) list =
        [
            "setup", setup
            "ImportExport", basicImportExport
            "MatMethods", basicMatMethods
            "Bands", basicBands
            "Grayscale", basicGrayscale
            "Resizing", basicResizing
            "Rotation", basicRotation
            "Flipping", basicFlipping
            "Brightening", basicBrightening
            "Contrast", basicContrast
            "Thresholding", basicThresholding
            "GammaCorrection", basicGammaCorrection
            "Blurring", basicBlurring
            "MorphologicalOperators", basicMorphologicalOperators
            "Gradients", basicGradients
            "HistogramEqualization", basicHistogramEqualization
            "Upscaling", basicUpscaling
            "Denoising", basicDenoising
        ]

    for title, example_func in examples do
        printSectionTitle title
        example_func ()


main ()
