package calculator

import (
	"math"
)

type Number interface {
	int64 | int32 | int16 | int8 | int | float64 | float32 | uint64 | uint32 | uint16 | uint8
}

// ---
// Basic
// ---

// Add adds two numbers
func Add[T Number](a, b T) T {
	return a + b
}

// Subtract subtracts two numbers
func Subtract[T Number](a, b T) T {
	return a - b
}

// Multiply multiplies two numbers
func Multiply[T Number](a, b T) T {
	return a * b
}

// Divide divides two numbers
func Divide[T Number](a, b T) float64 {
	if b == 0 {
		return math.NaN()
	}
	return float64(a) / float64(b)
}

// ---
// Aggregations
// ---

func reduce[I any, O any](items []I, reducerFunc func(acc O, curr I) O, initial O) O {
	result := initial
	for _, item := range items {
		result = reducerFunc(result, item)
	}
	return result
}

// Sum gets the sum of a slice of numbers
func Sum[T Number](numbers []T) T {
	sum := reduce(
		numbers,
		func(acc, curr T) T {
			return acc + curr
		},
		0,
	)
	return sum
}

// Product gets the product of a slice of numbers
func Product[T Number](numbers []T) T {
	product := reduce(
		numbers,
		func(acc, curr T) T {
			return acc * curr
		},
		1,
	)
	return product
}

// Mean gets the mean of a slice of numbers
func Mean[T Number](numbers []T) float64 {
	length := len(numbers)
	if length == 0 {
		return math.NaN()
	}
	sum := Sum(numbers)
	return float64(sum) / float64(length)

}

// Std gets the standard deviation of a slice of numbers
func Std[T Number](numbers []T, completeSample bool) float64 {
	length := len(numbers)
	if length == 0 {
		return math.NaN()
	}
	mean := Mean(numbers)
	sumOfSquaredDiffs := reduce(
		numbers,
		func(acc float64, curr T) float64 {
			return acc + math.Pow(float64(curr)-mean, 2)
		},
		0.0,
	)

	populationSize := length
	if !completeSample {
		populationSize -= 1
	}
	std := math.Sqrt(sumOfSquaredDiffs / float64(populationSize))
	return std
}
