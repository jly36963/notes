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
// Main
// ---

func main() {
	getRuntimeDetails()
	useBrighten()
	useColorBalance()
	useColorize()
	useContrast()
	useConvolution()
	// TODO: Crop
	useGamma()
	useGaussianBlur()
	useGrayscale()
	useInvert()
	// TODO: Maximum, mean, median, minimum
	useResize()
	// TODO: Resize to fill, resize to fit
	useSaturation()
	useSepia()
	useSigmoid()
	useSobel()
	useThreshold()
	// TODO: Unsharp mask
}

// ---
// Helper functions (print)
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
// Helper functions (file <-> image)
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
// Runtime details
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
// Brighten
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
	g := gift.New(gift.Brightness(brightness))
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
// Balance color
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
	g := gift.New(gift.ColorBalance(red, green, blue))
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
// Colorize
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
	g := gift.New(gift.Colorize(hue, saturation, percentage))
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
// Contrast
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
	g := gift.New(gift.Contrast(percentage))
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
// Convolution (edge detection)
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
	)
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
// Crop
// ---

//

// ---
// Gamma
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
	g := gift.New(gift.Gamma(gamma))
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
// Gaussian blur
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
	g := gift.New(gift.GaussianBlur(sigma))
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
// Grayscale
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
	g := gift.New(gift.Grayscale())
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
// Invert
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
	g := gift.New(gift.Invert())
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
// Maximum
// ---

//

// ---
// Resize
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
// Saturation
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
	g := gift.New(gift.Saturation(percentage))
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
// Sepia
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
	g := gift.New(gift.Sepia(percentage))
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
// Sigmoid
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
	g := gift.New(gift.Sigmoid(midpoint, factor))
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
// Sobel
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
	g := gift.New(gift.Sobel())
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
// Threshold
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
	g := gift.New(gift.Threshold(percentage))
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
// Unsharp mask
// ---

// TODO
