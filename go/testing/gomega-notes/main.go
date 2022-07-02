package main

import (
	"fmt"
	"gomega-notes/lib/calculator"
)

func main() {
	addResult := calculator.Add(1, 2)
	subtractResult := calculator.Subtract(1, 2)
	multiplyResult := calculator.Multiply(1, 2)
	divideResult := calculator.Divide(1, 2)

	sumResult := calculator.Sum([]int{1, 2, 3, 4, 5})
	productResult := calculator.Product([]int{1, 2, 3, 4, 5})
	meanResult := calculator.Mean([]int{1, 2, 3, 4, 5})
	stdResult := calculator.Std([]int{1, 2, 3, 4, 5}, false)

	fmt.Println("addResult: ", addResult)
	fmt.Println("subtractResult: ", subtractResult)
	fmt.Println("multiplyResult: ", multiplyResult)
	fmt.Println("divideResult: ", divideResult)
	fmt.Println("sumResult: ", sumResult)
	fmt.Println("productResult: ", productResult)
	fmt.Println("meanResult: ", meanResult)
	fmt.Println("stdResult: ", stdResult)
}
