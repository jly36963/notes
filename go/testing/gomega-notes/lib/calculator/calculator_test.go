package calculator

import (
	"math"
	"testing"

	. "github.com/onsi/ginkgo/v2"
	. "github.com/onsi/gomega"
)

func Test(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Calculator Suite")
}

var _ = Describe("calculator", func() {
	Describe("Add", func() {
		It("Adds integers", func() {
			result := Add(1, 2)
			Ω(result).Should(Equal(3))
		})
		It("Adds floats", func() {
			result := Add(1.0, 2.0)
			Ω(result).Should(Equal(3.0))
		})
	})
	Describe("Subtract", func() {
		It("Subtracts integers", func() {
			result := Subtract(1, 2)
			Ω(result).Should(Equal(-1))
		})
		It("Subtracts floats", func() {
			result := Subtract(1.0, 2.0)
			Ω(result).Should(Equal(-1.0))
		})
	})
	Describe("Multiply", func() {
		It("Multiplies integers", func() {
			result := Multiply(1, 2)
			Ω(result).Should(Equal(2))
		})
		It("Multiplies floats", func() {
			result := Multiply(1.0, 2.0)
			Ω(result).Should(Equal(2.0))
		})
	})
	Describe("Divide", func() {
		It("Divides integers", func() {
			result := Divide(1, 2)
			Ω(result).Should(Equal(.5))
		})
		It("Divides floats", func() {
			result := Divide(1.0, 2.0)
			Ω(result).Should(Equal(.5))
		})
		It("Handles divide by 0", func() {
			result := Divide(1, 0)
			Ω(math.IsNaN(result)).Should(Equal(true))

		})
	})
	Describe("Sum", func() {
		It("Sums integers", func() {
			result := Sum([]int{1, 2, 3, 4, 5})
			Ω(result).Should(Equal(15))
		})
		It("Sums floats", func() {
			result := Sum([]float64{1, 2, 3, 4, 5})
			Ω(result).Should(Equal(15.0))
		})
	})
	Describe("Product", func() {
		It("Products integers", func() {
			result := Product([]int{1, 2, 3, 4, 5})
			Ω(result).Should(Equal(120))
		})
		It("Products floats", func() {
			result := Product([]float64{1, 2, 3, 4, 5})
			Ω(result).Should(Equal(120.0))
		})
	})
	Describe("Mean", func() {
		It("Mean integers", func() {
			result := Mean([]int{1, 2, 3, 4, 5})
			Ω(result).Should(Equal(3.0))
		})
		It("Mean floats", func() {
			result := Mean([]float64{1, 2, 3, 4, 5})
			Ω(result).Should(Equal(3.0))
		})
		It("Mean empty", func() {
			result := Mean([]int{})
			Ω(math.IsNaN(result)).Should(Equal(true))
		})
	})
	Describe("Std", func() {
		It("Std integers", func() {
			result := Std([]int{1, 2, 3, 4}, false)
			Ω(result).Should(BeNumerically("~", 1.2909944487358056))
		})
		It("Std floats", func() {
			result := Std([]float64{1, 2, 3, 4}, false)
			Ω(result).Should(BeNumerically("~", 1.2909944487358056))
		})
		It("Std integers (complete sample)", func() {
			result := Std([]float64{1, 2, 3, 4}, true)
			Ω(result).Should(BeNumerically("~", 1.118033988749895))
		})
		It("Std empty", func() {
			result := Std([]int{}, true)
			Ω(math.IsNaN(result)).Should(Equal(true))
		})
	})
})
