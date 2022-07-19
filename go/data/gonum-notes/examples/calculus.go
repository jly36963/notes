package examples

import (
	"fmt"
	"gonum-notes/utils"
	"math"

	"gonum.org/v1/gonum/diff/fd"
	"gonum.org/v1/gonum/integrate/quad"
)

func BasicCalc() {
	utils.PrintSectionTitle("basic derivative")
	basicDerivative()

	utils.PrintSectionTitle("basic integral")
	basicIntegral()
}

func basicDerivative() {
	var f func(x float64) float64
	var input float64
	var df float64

	// ---
	// Default settings
	// ---

	f = func(x float64) float64 {
		// Power rule (differentiation)
		return math.Pow(x, 2) + 1
	}
	input = 2.0
	df = fd.Derivative(f, input, nil)
	fmt.Println("f(x) = x^2 + 1")
	fmt.Println("f'(x) = 2x")
	fmt.Println("f'(2) = 4")
	fmt.Println("Default settings result:", roundFloat(df, 3))

	// ---
	// Default settings (defaults chosen)
	// ---

	f = func(x float64) float64 {
		// Chain rule (differentiation)
		inner := math.Pow(x, 2) + 2*x + 1
		outer := math.Pow(inner, 3)
		return outer
	}
	input = 1.0
	df = fd.Derivative(f, input, &fd.Settings{
		Formula: fd.Forward,
		Step:    2e-8,
	})
	fmt.Println("f(x) = (x^2 + 2x + 1)^3")
	fmt.Println("f'(x) = 3 * (x^2 + 2x + 1)^2 * (2x + 2)")
	fmt.Println("f'(1) = 3 * 16 * 4 = 192")
	fmt.Println("Default settings (defaults chosen) result:", roundFloat(df, 3))
}

func basicIntegral() {
	f := func(x float64) float64 {
		return 2*x + 1
	}
	min := 0.0
	max := 2.0
	result := quad.Fixed(f, min, max, 3, nil, 0)
	fmt.Println("∫(0,2) 2x + 1 dx")
	fmt.Println("[x^2 + x] | 0,2")
	fmt.Println("(4 + 2) - (0 + 0) = 6")
	fmt.Println("result:", roundFloat(result, 3))

}
