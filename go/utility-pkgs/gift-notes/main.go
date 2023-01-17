package main

import (
	"fmt"
	"image"
	"image/jpeg"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/asaskevich/govalidator"
	"github.com/disintegration/gift"
)

// ---
// main
// ---

func main() {
	// Runtime
	getRuntimeDetails()
	// Brightness
	useBrighten()
	// Color balance
	useColorBalance()
	// Colorize
	useColorize()
	// Contrast
	useContrast()
	// Convolution
	useConvolution()
	// Crop
	// TODO
	// Gamma
	useGamma()
	// Gaussian blur
	useGaussianBlur()
	// Grayscale
	useGrayscale()
	// Invert
	useInvert()
	// Maximum, mean, median, minimum
	// TODO
	// Resize
	useResize()
	// Resize to fill, resize to fit
	// TODO
	// Saturation
	useSaturation()
	// Sepia
	useSepia()
	// Sigmoid
	useSigmoid()
	// Sobel
	useSobel()
	// Threshold
	useThreshold()
	// Unsharp mask
	// TODO
}

// ---
// helper functions (print)
// ---

func bulkPrint(args ...interface{}) {
	for _, a := range args {
		fmt.Println(a)
	}
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---
// helper functions (file <-> image)
// ---

func fileToImg(fp string) (img image.Image, err error) {
	// open file
	f, openErr := os.Open(fp)
	if openErr != nil {
		fmt.Println(openErr)
		err = openErr
		return
	}
	defer f.Close()
	// decode (file -> image)
	srcImg, _, decodeErr := image.Decode(f)
	if decodeErr != nil {
		fmt.Println(decodeErr)
		err = decodeErr
		return
	}
	img = srcImg
	return
}

func imgToFile(img image.Image, dir, fn string) (fp string, err error) {
	if _, existErr := os.Stat(dir); os.IsNotExist(existErr) {
		os.Mkdir(dir, os.ModePerm)
	}
	fp = filepath.Join(dir, fn)
	f, createErr := os.Create(fp)
	if createErr != nil {
		fmt.Println(createErr)
		err = createErr
		return
	}
	defer f.Close()
	encodeErr := jpeg.Encode(f, img, nil)
	if encodeErr != nil {
		fmt.Println(encodeErr)
		err = encodeErr
		return
	}
	err = nil
	return
}

// ---------
// notes
// ---------

// ---
// runtime details
// ---

type RuntimeDetails struct {
	Os      string `json:"os"`
	Arch    string `json:"arch"`
	CPUs    int    `json:"cpus"`
	Version string `json:"version"`
}

func getRuntimeDetails() {
	printSectionTitle("runtime")

	fmt.Printf("%+v\n", RuntimeDetails{
		Os:      runtime.GOOS,
		Arch:    runtime.GOARCH,
		CPUs:    runtime.NumCPU(),
		Version: runtime.Version(),
	})
}

// ---------
// gift
// ---------

// ---
// brighten
// ---

func brightenImage(path string, brightness float32) {
	// validate params
	if !govalidator.InRangeFloat32(brightness, -100, 100) {
		fmt.Println("Brightness parameter must be between -100 and 100")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Brightness(brightness)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("brighten-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useBrighten() {
	printSectionTitle("gift (brighten)")
	brightenImage("img/lion.jpg", 20)
}

// ---
// balance color
// ---

func balanceColor(path string, red, green, blue float32) {
	// validate params
	for _, color := range []float32{red, green, blue} {
		if !govalidator.InRangeFloat32(color, -100, 500) {
			fmt.Println("Color percentage parameters must be between -100 and 500")
			return
		}
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.ColorBalance(red, green, blue)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("colorbalance-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useColorBalance() {
	printSectionTitle("gift (color balance)")
	balanceColor("img/lion.jpg", 20, 0, 20)
}

// ---
// colorize
// ---

type ColorizeParam struct {
	Name            string
	Value, Min, Max float32
}

func colorize(path string, hue, saturation, percentage float32) {

	// validate params
	params := []ColorizeParam{
		{Name: "hue", Value: hue, Min: 0, Max: 360},
		{Name: "saturation", Value: saturation, Min: 0, Max: 100},
		{Name: "percentage", Value: percentage, Min: 0, Max: 100},
	}
	for _, param := range params {
		if !govalidator.InRangeFloat32(param.Value, param.Min, param.Max) {
			fmt.Println(
				fmt.Sprintf(
					"Colorize parameter (%s) must be between %.2f and %.2f",
					param.Name, param.Min, param.Max,
				),
			)
			return
		}
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Colorize(hue, saturation, percentage)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("colorize-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useColorize() {
	printSectionTitle("gift (colorize)")
	colorize("img/lion.jpg", 360, 50, 50)
}

// ---
// contrast
// ---

func contrast(path string, percentage float32) {
	// validate params
	if !govalidator.InRangeFloat32(percentage, -100, 100) {
		fmt.Println("Brightness parameter must be between -100 and 100")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Contrast(percentage)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("contrast-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useContrast() {
	printSectionTitle("gift (contrast)")
	contrast("img/lion.jpg", 30)
}

// ---
// convolution (edge detection)
// ---

func convolveEdge(path string) {
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(
		gift.Convolution(
			[]float32{
				-1, -1, -1,
				-1, 8, -1,
				-1, -1, -1,
			},
			false, // normalize
			false, // alpha
			false, // abs
			0,     // delta
		),
	) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("convolve-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useConvolution() {
	printSectionTitle("gift (convolution edge)")
	convolveEdge("img/lion.jpg")
}

// ---
// crop
// ---

//

// ---
// gamma
// ---

func gamma(path string, gamma float32) {
	// validate params
	if !govalidator.InRangeFloat32(gamma, 0, 10) {
		fmt.Println("gamma must be between 0 and 10")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Gamma(gamma)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("gamma-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useGamma() {
	printSectionTitle("gift (gamma)")
	gamma("img/lion.jpg", 3)
}

// ---
// gaussian blur
// ---

func blurImage(path string, sigma float32) {
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.GaussianBlur(sigma)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("blur-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useGaussianBlur() {
	printSectionTitle("gift (blur)")
	blurImage("img/lion.jpg", 2)
}

// ---
// grayscale
// ---

func grayscale(path string) {
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Grayscale()) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("grayscale-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useGrayscale() {
	printSectionTitle("gift (grayscale)")
	grayscale("img/lion.jpg")
}

// ---
// invert
// ---

func invert(path string) {

	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Invert()) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("invert-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useInvert() {
	printSectionTitle("gift (invert)")
	invert("img/lion.jpg")
}

// ---
// maximum
// ---

//

// ---
// resize
// ---

func resizeImage(path string, maxDimensionSize int) {
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// use image
	bounds := srcImg.Bounds()
	h := bounds.Max.Y - bounds.Min.Y
	w := bounds.Max.X - bounds.Min.X
	// transform image
	var g *gift.GIFT
	var nh int
	var nw int
	if h > w {
		nh = maxDimensionSize
		nw = 0 // preserve aspect ratio
	} else {
		nh = 0
		nw = maxDimensionSize
	}
	g = gift.New(
		gift.Resize(
			nw,                     // width
			nh,                     // height
			gift.LanczosResampling, // resampling method
		),
	)
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("resize-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useResize() {
	printSectionTitle("gift (resize)")
	resizeImage("img/lion.jpg", 300)
}

// ---
// saturation
// ---

func saturation(path string, percentage float32) {
	// validate params
	if !govalidator.InRangeFloat32(percentage, -100, 500) {
		fmt.Println("percentage must be between -100 and 500")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Saturation(percentage)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("saturation-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useSaturation() {
	printSectionTitle("gift (saturation)")
	saturation("img/lion.jpg", -50)
}

// ---
// sepia
// ---

func sepia(path string, percentage float32) {
	// validate params
	if !govalidator.InRangeFloat32(percentage, 0, 100) {
		fmt.Println("percentage must be between 0 and 100")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Sepia(percentage)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("sepia-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useSepia() {
	printSectionTitle("gift (sepia)")
	sepia("img/lion.jpg", 40)
}

// ---
// sigmoid
// ---

func sigmoid(path string, midpoint, factor float32) {
	// validate params
	if !govalidator.InRangeFloat32(midpoint, 0, 1) {
		fmt.Println("midpoint must be between 0 and 1")
		return
	}
	if !govalidator.InRangeFloat32(factor, -10, 10) {
		fmt.Println("factor must be between 0 and 1")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Sigmoid(midpoint, factor)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("sigmoid-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useSigmoid() {
	printSectionTitle("gift (sigmoid)")
	sigmoid("img/lion.jpg", .5, .1) // TODO: Sanity check args
}

// ---
// sobel
// ---

func sobel(path string) {
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Sobel()) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("sobel-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useSobel() {
	printSectionTitle("gift (sobel)")
	sobel("img/lion.jpg")
}

// ---
// threshold
// ---

func threshold(path string, percentage float32) {
	// validate params
	if !govalidator.InRangeFloat32(percentage, 0, 100) {
		fmt.Println("percentage must be between 0 and 100")
		return
	}
	// file to image
	fp := filepath.FromSlash(path)
	dir, fn := filepath.Split(fp)
	srcImg, imgErr := fileToImg(fp)
	if imgErr != nil {
		fmt.Println(imgErr)
		return
	}
	// transform image
	g := gift.New(gift.Threshold(percentage)) // *gift.GIFT
	dstImg := image.NewRGBA(g.Bounds(srcImg.Bounds()))
	g.Draw(dstImg, srcImg)
	// img to file
	fn2 := fmt.Sprintf("threshold-%s", fn)
	dir2 := filepath.Join(dir, "output")
	fp2, fileErr := imgToFile(dstImg, dir2, fn2)
	if fileErr != nil {
		fmt.Println(fileErr)
		return
	}
	// print results
	bulkPrint(
		"fp", fp2,
	)
}

func useThreshold() {
	printSectionTitle("gift (threshold)")
	threshold("img/lion.jpg", 30)
}

// ---
// unsharp mask
// ---

//
