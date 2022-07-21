package examples

import (
	"fmt"
	"math/rand"
	"os"
	"sort"
	"strings"

	"gonum-notes/utils"

	"github.com/go-gota/gota/dataframe"
	xrand "golang.org/x/exp/rand"
	"gonum.org/v1/gonum/mat"
	"gonum.org/v1/gonum/stat"
	"gonum.org/v1/gonum/stat/distuv"
)

func BasicStat() {
	// Vector
	utils.PrintSectionTitle("basic aggregation")
	basicAggregations()

	utils.PrintSectionTitle("basic uniform distribution (continuous)")
	basicUniformDistribution()

	utils.PrintSectionTitle("basic normal distribution (continuous)")
	basicNormalDistribution()

	utils.PrintSectionTitle("basic exponential distribution (continuous)")
	basicExponentialDistribution()

	utils.PrintSectionTitle("basic poisson distribution (discrete)")
	basicPoissonDistribution()

	utils.PrintSectionTitle("basic binomial distribution (discrete)")
	basicBinomialnDistribution()

	// TODO: nbinomial geometric

	utils.PrintSectionTitle("basic linear regression")
	basicLinearRegression()

	utils.PrintSectionTitle("basic multivariate statistics")
	basicMultivariateStatistics()

}

func basicAggregations() {
	s1 := []float64{1.0, 2.0, 3.0, 4.0, 5.0}

	min, _ := getMin(s1)
	fmt.Println("min:", s1, min)

	max, _ := getMax(s1)
	fmt.Println("max:", s1, max)

	median := stat.Quantile(.5, stat.Empirical, s1, nil)
	fmt.Println("median:", s1, median)

	s2 := append(s1, 5.0)
	mode, modeCount := stat.Mode(s2, nil)
	fmt.Println("mode:", s2, mode, modeCount)

	mean := stat.Mean(s1, nil)
	fmt.Println("mean:", s1, mean)

	geometricMean := stat.GeometricMean(s1, nil)
	fmt.Println("geometricMean:", s1, roundFloat(geometricMean, 3))

	harmonicMean := stat.HarmonicMean(s1, nil)
	fmt.Println("harmonicMean:", s1, roundFloat(harmonicMean, 3))

	sampleStd := stat.StdDev(s1, nil)
	fmt.Println("sampleStd:", s1, roundFloat(sampleStd, 3))

	populationStd := stat.PopStdDev(s1, nil)
	fmt.Println("populationStd:", s1, roundFloat(populationStd, 3))

	sampleVar := stat.Variance(s1, nil)
	fmt.Println("sampleVar:", s1, roundFloat(sampleVar, 3))

	populationVar := stat.PopVariance(s1, nil)
	fmt.Println("populationVar:", s1, roundFloat(populationVar, 3))

	s3 := append(s1, -5) // Left skewed
	skew := stat.Skew(s3, nil)
	fmt.Println("skew:", s3, roundFloat(skew, 3))

	s4 := append(s1, 3, 3, 3)
	kurtosis := stat.ExKurtosis(s4, nil)
	fmt.Println("kurtosis:", s4, roundFloat(kurtosis, 3))
}

func basicUniformDistribution() {
	s1 := uniformDist(100, 0, 10)
	sort.Float64s(s1)

	bins := rangeFloat64(0, 10, 2)
	fmt.Println("bins:", bins)
	hist := stat.Histogram(nil, bins, s1, nil)
	fmt.Println("hist:", hist)

	mean := stat.Mean(s1, nil)
	fmt.Println("mean:", roundFloat(mean, 3))

	median := stat.Quantile(.5, stat.Empirical, s1, nil)
	fmt.Println("median:", roundFloat(median, 3))

	sampleStd := stat.StdDev(s1, nil)
	fmt.Println("sampleStd:", roundFloat(sampleStd, 3))

	skew := stat.Skew(s1, nil)
	fmt.Println("skew:", roundFloat(skew, 3))

	kurtosis := stat.ExKurtosis(s1, nil)
	fmt.Println("kurtosis:", roundFloat(kurtosis, 3))

	q := 5.0
	cdf := stat.CDF(q, stat.Empirical, s1, nil)
	fmt.Println("cdf", q, ":", cdf)

	p := .9
	ppf := stat.Quantile(p, stat.Empirical, s1, nil)
	fmt.Println("ppf:", p, ":", roundFloat(ppf, 3))
}

func basicNormalDistribution() {
	s1 := normalDist(100, 0, 1)
	sort.Float64s(s1)

	bins := rangeFloat64(-5, 5, 1)
	fmt.Println("bins:", bins)
	hist := stat.Histogram(nil, bins, s1, nil)
	fmt.Println("hist:", hist)

	mean := stat.Mean(s1, nil)
	fmt.Println("mean:", roundFloat(mean, 3))

	median := stat.Quantile(.5, stat.Empirical, s1, nil)
	fmt.Println("median:", roundFloat(median, 3))

	sampleStd := stat.StdDev(s1, nil)
	fmt.Println("sampleStd:", roundFloat(sampleStd, 3))

	skew := stat.Skew(s1, nil)
	fmt.Println("skew:", roundFloat(skew, 3))

	kurtosis := stat.ExKurtosis(s1, nil)
	fmt.Println("kurtosis:", roundFloat(kurtosis, 3))

	q := 0.0
	cdf := stat.CDF(q, stat.Empirical, s1, nil)
	fmt.Println("cdf", q, ":", cdf)

	p := .9
	ppf := stat.Quantile(p, stat.Empirical, s1, nil)
	fmt.Println("ppf:", p, ":", roundFloat(ppf, 3))
}

func basicExponentialDistribution() {
	s1 := exponentialDist(100)
	sort.Float64s(s1)

	bins := rangeFloat64(0, 10, 1)
	fmt.Println("bins:", bins)
	hist := stat.Histogram(nil, bins, s1, nil)
	fmt.Println("hist:", hist)

	mean := stat.Mean(s1, nil)
	fmt.Println("mean:", roundFloat(mean, 3))

	median := stat.Quantile(.5, stat.Empirical, s1, nil)
	fmt.Println("median:", roundFloat(median, 3))

	sampleStd := stat.StdDev(s1, nil)
	fmt.Println("sampleStd:", roundFloat(sampleStd, 3))

	skew := stat.Skew(s1, nil)
	fmt.Println("skew:", roundFloat(skew, 3))

	kurtosis := stat.ExKurtosis(s1, nil)
	fmt.Println("kurtosis:", roundFloat(kurtosis, 3))

	q := 1.5
	cdf := stat.CDF(q, stat.Empirical, s1, nil)
	fmt.Println("cdf", q, ":", cdf)

	p := .9
	ppf := stat.Quantile(p, stat.Empirical, s1, nil)
	fmt.Println("ppf:", p, ":", roundFloat(ppf, 3))
}

func basicPoissonDistribution() {
	s1 := poissonDist(100, 1)
	sort.Float64s(s1)

	bins := rangeFloat64(0, 10, 1)
	fmt.Println("bins:", bins)
	hist := stat.Histogram(nil, bins, s1, nil)
	fmt.Println("hist:", hist)

	mean := stat.Mean(s1, nil)
	fmt.Println("mean:", roundFloat(mean, 3))

	median := stat.Quantile(.5, stat.Empirical, s1, nil)
	fmt.Println("median:", roundFloat(median, 3))

	sampleStd := stat.StdDev(s1, nil)
	fmt.Println("sampleStd:", roundFloat(sampleStd, 3))

	skew := stat.Skew(s1, nil)
	fmt.Println("skew:", roundFloat(skew, 3))

	kurtosis := stat.ExKurtosis(s1, nil)
	fmt.Println("kurtosis:", roundFloat(kurtosis, 3))

	q := 1.5
	cdf := stat.CDF(q, stat.Empirical, s1, nil)
	fmt.Println("cdf", q, ":", cdf)

	p := .9
	ppf := stat.Quantile(p, stat.Empirical, s1, nil)
	fmt.Println("ppf:", p, ":", roundFloat(ppf, 3))

	val := 1.0
	pmf := pmf(s1, val)
	fmt.Println("pmf:", val, ":", pmf)
}

func basicBinomialnDistribution() {
	s1 := binomialDist(100, 10, .50)
	sort.Float64s(s1)

	bins := rangeFloat64(0, 10, 1)
	fmt.Println("bins:", bins)
	hist := stat.Histogram(nil, bins, s1, nil)
	fmt.Println("hist:", hist)

	mean := stat.Mean(s1, nil)
	fmt.Println("mean:", roundFloat(mean, 3))

	median := stat.Quantile(.5, stat.Empirical, s1, nil)
	fmt.Println("median:", roundFloat(median, 3))

	sampleStd := stat.StdDev(s1, nil)
	fmt.Println("sampleStd:", roundFloat(sampleStd, 3))

	skew := stat.Skew(s1, nil)
	fmt.Println("skew:", roundFloat(skew, 3))

	kurtosis := stat.ExKurtosis(s1, nil)
	fmt.Println("kurtosis:", roundFloat(kurtosis, 3))

	q := 5.0
	cdf := stat.CDF(q, stat.Empirical, s1, nil)
	fmt.Println("cdf", q, ":", cdf)

	p := .9
	ppf := stat.Quantile(p, stat.Empirical, s1, nil)
	fmt.Println("ppf:", p, ":", roundFloat(ppf, 3))

	val := 5.0
	pmf := pmf(s1, val)
	fmt.Println("pmf:", val, ":", pmf)
}

func basicLinearRegression() {
	x := []float64{1, 2, 3, 4, 5}
	y := []float64{4, 7, 10, 13, 16}
	alpha, beta := stat.LinearRegression(x, y, nil, false)

	fmt.Println("y = 3x + 1")
	fmt.Println("x:", x)
	fmt.Println("y:", y)
	fmt.Println("alpha:", alpha)
	fmt.Println("beta:", beta)
}

func basicMultivariateStatistics() {
	fn := "./data/iris.csv"
	df := dfFromCsvFile(fn)
	fmt.Println("df")
	fmt.Println("names:", df.Names())
	fmt.Println("cols", df.Ncol())
	fmt.Println("rows", df.Nrow())

	sepalLength := df.Col("sepal_length").Float()
	sepalWidth := df.Col("sepal_width").Float()
	petalLength := df.Col("petal_length").Float()
	petalWidth := df.Col("petal_width").Float()

	floatDf := df.Select([]string{"sepal_length", "sepal_width", "petal_length", "petal_width"})
	m := matrixFromFloatDf(floatDf)

	// Correlation
	corr := stat.Correlation(sepalLength, sepalWidth, nil)
	fmt.Println("corr (sepal length, sepal width):", roundFloat(corr, 2))

	// Covariance
	cov := stat.Covariance(petalLength, petalWidth, nil)
	fmt.Println("cov (petal length, petal width):", roundFloat(cov, 2))

	// Correlation matrix
	corrMat := mat.NewSymDense(floatDf.Ncol(), nil)
	stat.CorrelationMatrix(corrMat, m, nil)
	corrMatDense := mat.DenseCopyOf(corrMat)
	corrMatDense.Apply(func(i, j int, v float64) float64 {
		return roundFloat(v, 2)
	}, corrMatDense)
	fmt.Println("correlation matrix")
	prettyPrintMatrix(corrMatDense)

	// Covariance matrix
	covMat := mat.NewSymDense(floatDf.Ncol(), nil)
	stat.CovarianceMatrix(covMat, m, nil)
	covMatDense := mat.DenseCopyOf(covMat)
	covMatDense.Apply(func(i, j int, v float64) float64 {
		return roundFloat(v, 2)
	}, covMatDense)
	fmt.Println("covariance matrix")
	prettyPrintMatrix(covMatDense)
}

// TODO:
// Pearson correlation coefficient (r and p-value)
// Hypothesis testing (t-test, z-test, shapiro-wilk, mww ranksum, anova)
// outliers (IQR)

// ---
// Helpers (df)
// ---

func dfFromCsvFile(fn string) dataframe.DataFrame {
	bytes, err := os.ReadFile(fn)
	if err != nil {
		panic(err)
	}
	csv := string(bytes)
	df := dataframe.ReadCSV(strings.NewReader(csv))
	return df
}

func matrixFromFloatDf(df dataframe.DataFrame) *mat.Dense {
	names := df.Names()
	cols := len(names)
	rows := df.Nrow()
	values := make([]float64, 0, cols*rows)
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			values = append(values, df.Elem(r, c).Float())
		}
	}
	m := mat.NewDense(rows, cols, values)
	return m
}

// ---
// Helpers (agg)
// ---

type Number interface {
	int64 | int32 | int16 | int8 | int | float64 | float32 | uint64 | uint32 | uint16 | uint8
}

// getMax returns the maximum number and if the maximum is valid
func getMax[T Number](numbers []T) (T, bool) {
	if len(numbers) == 0 {
		return 0, false
	}
	m := numbers[0]
	for _, n := range numbers[1:] {
		if n > m {
			m = n
		}
	}
	return m, true
}

// getMin returns the minimum number and if the minimum is valid
func getMin[T Number](numbers []T) (T, bool) {
	if len(numbers) == 0 {
		return 0, false
	}
	m := numbers[0]
	for _, n := range numbers[1:] {
		if n < m {
			m = n
		}
	}
	return m, true
}

/*
// median returns the median and if the median is valid
func getMedian[T Number](numbers []T) (T, bool) {
	length := len(numbers)
	if length == 0 {
		return 0, false
	}
	var median T
	midIndex := length / 2
	if length%2 == 0 {
		median = numbers[midIndex-1] + numbers[midIndex]/2
	} else {
		median = numbers[midIndex]
	}
	return median, true
}

median, _ := getMedian(s1)
fmt.Println("median:", s1, median)
*/

// ---
// Helpers (dist)
// ---

// rangeFloat64 creates a range as a slice of float64
func rangeFloat64(start, end, step int) []float64 {
	if (start > end) || step < 1 {
		return []float64{}
	}
	size := (end-start)/step + 1
	result := make([]float64, 0, size)
	for i := start; i <= end; i += step {
		result = append(result, float64(i))
	}
	return result
}

func uniformDist(size int, min, max float64) []float64 {
	if size < 1 {
		return []float64{}
	}
	result := make([]float64, 0, size)
	for i := 0; i < size; i++ {
		r := min + rand.Float64()*(max-min)
		result = append(result, r)
	}
	return result
}

func normalDist(size int, center, scale float64) []float64 {
	if size < 1 {
		return []float64{}
	}
	result := make([]float64, 0, size)
	for i := 0; i < size; i++ {
		r := center + rand.NormFloat64()*(scale)
		result = append(result, r)
	}
	return result
}

func exponentialDist(size int) []float64 {
	if size < 1 {
		return []float64{}
	}
	result := make([]float64, 0, size)
	for i := 0; i < size; i++ {
		// rand.ExpFloat64 returns values between 0 and math.MaxFloat64
		result = append(result, rand.ExpFloat64())
	}
	return result
}

func poissonDist(size int, lambda float64) []float64 {
	if size < 1 {
		return []float64{}
	}

	// Pseudo-random source
	// eg: xrand.NewSource(uint64(time.Now().UnixNano()))
	src := xrand.NewSource(1)

	poisson := distuv.Poisson{
		Lambda: lambda,
		Src:    src,
	}

	result := make([]float64, 0, size)
	for i := 0; i < size; i++ {
		result = append(result, poisson.Rand())
	}
	return result
}

func binomialDist(size int, n, p float64) []float64 {
	if size < 1 {
		return []float64{}
	}

	binomial := distuv.Binomial{
		N:   n, // Number of Bernoulli trials
		P:   p, // Probability of success
		Src: xrand.NewSource(1),
	}

	result := make([]float64, 0, size)
	for i := 0; i < size; i++ {
		result = append(result, binomial.Rand())
	}
	return result
}

// ---
// Helpers (dist func)
// ---

// pmf returns the probability that a discrete random variable is exactly some value
func pmf(x []float64, val float64) float64 {
	l := len(x)
	matches := 0
	for _, n := range x {
		if n == val {
			matches++
		}
	}
	return float64(matches) / float64(l)
}
