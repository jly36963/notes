package examples

import (
	"fmt"
	"math"
	"math/rand"

	"gonum-notes/utils"

	"gonum.org/v1/gonum/mat"
)

func BasicMat() {
	// ---
	// Vector
	// ---

	utils.PrintSectionTitle("basic vector creation")
	basicVectorCreation()

	utils.PrintSectionTitle("basic vector copy")
	basicVectorCopy()

	utils.PrintSectionTitle("basic vector selection")
	basicVectorSelection()

	utils.PrintSectionTitle("basic vector details")
	basicVectorDetails()

	utils.PrintSectionTitle("basic vector operations")
	basicVectorOperations()

	// ---
	// Matrix
	// ---

	utils.PrintSectionTitle("basic matrix creation")
	basicMatrixCreation()

	utils.PrintSectionTitle("basic matrix copy")
	basicMatrixCopy()

	utils.PrintSectionTitle("basic matrix selection")
	basicMatrixSelection()

	utils.PrintSectionTitle("basic matrix details")
	basicMatrixDetails()

	utils.PrintSectionTitle("basic matrix comparison")
	basicMatrixComparison()

	utils.PrintSectionTitle("basic matrix operations")
	basicMatrixOperations()

	utils.PrintSectionTitle("basic matrix apply")
	basicMatrixApply()

	// ---
	// Matrix & Vector
	// ---

	utils.PrintSectionTitle("basic matrix & vector operations")
	basicVectorAndMatrixOperations()
}

func basicVectorCreation() {
	var v *mat.VecDense
	var data []float64

	// Dense: no backing data
	v = mat.NewVecDense(10, nil)
	fmt.Println("without backing data")
	fmt.Println(v)

	// Dense: backing data
	data = make([]float64, 10)
	for i := range data {
		data[i] = float64(i + 1)
	}
	v = mat.NewVecDense(10, data)
	fmt.Println("with backing data")
	fmt.Println(v)
}

func basicVectorCopy() {
	var v *mat.VecDense
	var v2 *mat.VecDense

	// Source
	v = getBasicVector10()
	fmt.Println("source")
	fmt.Println(v)

	// Receiver (should have same dimensions)
	v2 = mat.NewVecDense(10, nil)
	v2.CopyVec(v)
	fmt.Println("copy")
	fmt.Println(v2)
}

func basicVectorSelection() {
	v := getBasicVector10()

	// Read
	elem := v.AtVec(3)
	fmt.Println("selected element (3): ", elem)

	slice := v.SliceVec(3, 5)
	fmt.Println("selected slice (3-5): ", slice)

	// Set
	v.SetVec(3, 3)
}

func basicVectorDetails() {
	v := getBasicVector10()
	fmt.Println(v)

	isEmpty := v.IsEmpty()
	fmt.Println("isEmpty: ", isEmpty)
	len := v.Len()
	fmt.Println("len: ", len)
	cap := v.Cap()
	fmt.Println("cap: ", cap)
	rows, cols := v.Dims()
	fmt.Println("dims: ", rows, cols)
}

func basicVectorOperations() {
	var v *mat.VecDense
	var v2 *mat.VecDense

	fmt.Println("vector of float64(i + 1)")
	v = getBasicVector10()
	fmt.Println("receiver vector")
	v2 = mat.NewVecDense(10, nil)

	v2.AddScaledVec(v, 3, v)
	fmt.Println("vector addition scaled")
	fmt.Println(v2)

	v2.AddVec(v, v)
	fmt.Println("vector addition")
	fmt.Println(v2)

	v2.DivElemVec(v, v)
	fmt.Println("vector division (element-wise)")
	fmt.Println(v2)

	v2.MulElemVec(v, v)
	fmt.Println("vector multiplication (element-wise)")
	fmt.Println(v2)

	// var m *mat.Dense
	// v2.MulVec(m, v) // m @ v // m cols == v rows
	// fmt.Println("vector multiplication")
	// fmt.Println(v2)

	v2.ScaleVec(3, v)
	fmt.Println("vector scaling")
	fmt.Println(v2)

	v2.SubVec(v, v)
	fmt.Println("vector subtraction")
	fmt.Println(v2)

	v2.Zero()
	fmt.Println("vector zero")
	fmt.Println(v2)
}

// ---
// ---
// ---

func basicMatrixCreation() {
	var m *mat.Dense
	var data []float64

	// Dense: no backing data
	m = mat.NewDense(4, 5, nil)
	fmt.Println("without backing data")
	prettyPrintMatrix(m)

	// Dense: backing data
	data = make([]float64, 20)
	for i := range data {
		data[i] = float64(i + 1)
	}
	m = mat.NewDense(4, 5, data)
	fmt.Println("with backing data")
	prettyPrintMatrix(m)
}

func basicMatrixCopy() {
	var m *mat.Dense
	var m2 *mat.Dense

	// Source
	m = getBasicMatrix5By5()
	fmt.Println("source")
	prettyPrintMatrix(m)

	// Receiver (should have same dimensions)
	m2 = mat.NewDense(5, 5, nil)
	m2.Copy(m)
	fmt.Println("copy")
	prettyPrintMatrix(m2)
}

func basicMatrixSelection() {
	m := getBasicMatrix4By5()

	// Read
	cell := m.At(3, 4)
	fmt.Println("selected cell (3, 4): ", cell)
	col := mat.Col(nil, 2, m)
	fmt.Println("selected col (2): ", col)
	row := mat.Row(nil, 2, m)
	fmt.Println("selected row (2): ", row)

	// TODO: slice

	// Set
	m.Set(3, 4, 20)
	m.SetCol(3, []float64{3, 8, 13, 18})
	m.SetRow(3, []float64{11, 12, 13, 14, 15})
}

func basicMatrixDetails() {
	m := getBasicMatrix5By5()

	// Functions from mat
	max := mat.Max(m)
	fmt.Println("max: ", max)
	min := mat.Min(m)
	fmt.Println("min: ", min)
	sum := mat.Sum(m)
	fmt.Println("sum: ", sum)

	// Dense matrix methods
	rows, columns := m.Dims() // TODO: Dims vs Caps
	fmt.Println("dims: ", rows, columns)
	isEmpty := m.IsEmpty()
	fmt.Println("isEmpty: ", isEmpty)

}

func basicMatrixComparison() {
	m := getBasicMatrix4By5()

	equal := mat.Equal(m, m)
	fmt.Println("equal: ", equal)

	equalApprox := mat.EqualApprox(m, m, .001)
	fmt.Println("equalApprox: ", equalApprox)
}

func basicMatrixOperations() {
	var m *mat.Dense
	var m2 *mat.Dense

	m = getBasicMatrix4By5()
	fmt.Println("matrix of float64(i + 1)")
	prettyPrintMatrix(m)
	m2 = mat.NewDense(4, 5, nil)

	// Two matrices
	m2.Add(m, m)
	fmt.Println("matrix add")
	prettyPrintMatrix(m2)

	m2.Sub(m, m)
	fmt.Println("matrix subtract")
	prettyPrintMatrix(m2)

	m2.Reset()       // Reset to empty value
	m2.Mul(m, m.T()) // A columns == B rows
	fmt.Println("matrix product")
	prettyPrintMatrix(m2)

	fmt.Println("matrix product (standard)")
	prettyPrintMatrix(m2)

	m2.Reset()
	m2.MulElem(m, m)
	fmt.Println("matrix product (element-wise) (hadamard)")
	prettyPrintMatrix(m2)

	m2.DivElem(m, m)
	fmt.Println("matrix quotient (element-wise)")
	prettyPrintMatrix(m2)

	m2.Scale(2.0, m)
	fmt.Println("matrix product (using scalar value)")
	prettyPrintMatrix(m2)

	m2.Zero()
	fmt.Println("matrix zero")
	prettyPrintMatrix(m2)
}

func basicMatrixApply() {
	var m *mat.Dense

	m = getBasicMatrix5By5RandNorm()
	fmt.Println("random normalized float64")
	prettyPrintMatrix(m)
	m.Apply(func(i, j int, v float64) float64 {
		return roundFloat(math.Pow(v, 2.0), 2)
	}, m)
	fmt.Println("squared")
	prettyPrintMatrix(m)

	m = getBasicMatrix5By5()
	fmt.Println("matrix of float64(i + 1)")
	prettyPrintMatrix(m)
	m.Apply(func(i, j int, v float64) float64 {
		return v + 1
	}, m)
	fmt.Println("plus 1")
	prettyPrintMatrix(m)
}

func basicVectorAndMatrixOperations() {
	var v *mat.VecDense
	var m *mat.Dense
	var product float64

	v = getBasicVector10()
	m = mat.NewDense(10, 10, nil)
	m.Mul(v, v.T())
	fmt.Println("vector product (v * vt)")
	prettyPrintMatrix(m)

	m = mat.NewDense(1, 1, nil)
	m.Mul(v.T(), v)
	fmt.Println("vector product (vt * v)")
	prettyPrintMatrix(m)

	product = mat.Dot(v, v)
	mat.Dot(v, v)
	fmt.Println("dot(v, v)")
	fmt.Println(product)
}

// ---
// Helpers
// ---

// roundFloat rounds a float to a specified precision
func roundFloat(n float64, precision int) float64 {
	if precision < 0 {
		precision = 0
	}
	v := math.Pow(float64(10), float64(precision))
	return math.Round(n*v) / v
}

// ---
// Generate vector
// ---

func getBasicVector10() *mat.VecDense {
	data := make([]float64, 10)
	for i := range data {
		data[i] = float64(i + 1)
	}
	v := mat.NewVecDense(10, data)
	return v
}

// ---
// Generate matrix
// ---

// getBasicMatrix4By5 returns a 4x5 dense matrix
func getBasicMatrix4By5() *mat.Dense {
	data := make([]float64, 20)
	for i := range data {
		data[i] = float64(i + 1)
	}
	m := mat.NewDense(4, 5, data)
	return m
}

// getBasicMatrix5By5 returns a 5x5 dense matrix
func getBasicMatrix5By5() *mat.Dense {
	data := make([]float64, 25)
	for i := range data {
		data[i] = float64(i + 1)
	}
	m := mat.NewDense(5, 5, data)
	return m
}

// getBasicMatrix5By5 returns a 5x5 dense matrix with normalized random float64
func getBasicMatrix5By5RandNorm() *mat.Dense {
	data := make([]float64, 25)
	for i := range data {
		data[i] = roundFloat(rand.NormFloat64(), 2)
	}
	m := mat.NewDense(5, 5, data)
	return m
}

// ---
// Print
// ---

func prettyPrintMatrix(m mat.Matrix) {
	fm := mat.Formatted(m, mat.Squeeze())
	fmt.Printf("%+v\n", fm)
}
