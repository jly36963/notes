package main

import (
	"fmt"
	"strings"
)

func main() {
	printSectionTitle("basic generic add")
	basicGenericAdd()

	printSectionTitle("basic generic find int")
	basicGenericFindInt()

	printSectionTitle("basic generic find struct")
	basicGenericFindStruct()

	printSectionTitle("basic generic map same type")
	basicGenericMapSameType()

	printSectionTitle("basic generic map different type")
	basicGenericMapDifferentType()

	printSectionTitle("basic generic reduce same type")
	basicGenericReduceSameType()

	printSectionTitle("basic generic reduce different type")
	basicGenericReduceDifferentType()

	printSectionTitle("basic generic filter")
	basicFilter()
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---
// Sum
// ---

type Number interface {
	int64 | int32 | int16 | int8 | float64 | float32 | uint64 | uint32 | uint16 | uint8
}

func sumNumbers[T Number](numbers []T) T {
	var sum T
	for _, n := range numbers {
		sum += n
	}
	return sum
}

func basicGenericAdd() {
	// Unnecessary type arguments included
	sumInts := sumNumbers[int32]([]int32{1, 2, 3, 4, 5})
	sumfloats := sumNumbers[float32]([]float32{1, 2, 3, 4, 5})
	// Type args inferred
	sumInferred := sumNumbers([]float32{1, 2, 3, 4, 5})

	fmt.Println("sumInts: ", sumInts)
	fmt.Println("sumfloats: ", sumfloats)
	fmt.Println("sumInferred: ", sumInferred)
}

// ---
// Find
// ---

func find[T any](items []T, predicate func(curr T) bool) (T, bool) {
	var match T
	for _, item := range items {
		if found := predicate(item); found {
			return item, true
		}
	}
	return match, false
}

func basicGenericFindInt() {
	num, found := find[int16](
		[]int16{1, 2, 3, 4, 5},
		func(n int16) bool {
			return n > 3
		},
	)
	fmt.Println("found:", found)
	fmt.Println("num:", num)
}

type ninja struct {
	firstName string
	lastName  string
	age       int8
}

func basicGenericFindStruct() {
	ninja, found := find[ninja](
		[]ninja{
			{firstName: "Iruka", lastName: "Umino", age: 24},
			{firstName: "Tenzo", lastName: "Yamato", age: 26},
			{firstName: "Kakashi", lastName: "Hatake", age: 27},
		},
		func(n ninja) bool {
			return n.firstName == "Kakashi"
		},
	)
	fmt.Println("found:", found)
	fmt.Println(fmt.Sprintf("ninja: %+v", ninja))
}

// ---
// Map
// ---

func mapSlice[I any, O any](items []I, mapperFunc func(curr I) O) []O {
	var results []O
	for _, item := range items {
		results = append(results, mapperFunc(item))
	}
	return results
}

func basicGenericMapSameType() {
	mapped := mapSlice[int32, int32](
		[]int32{1, 2, 3, 4, 5},
		func(curr int32) int32 {
			return curr + 1
		},
	)
	fmt.Println("mapped:", mapped)
}

func basicGenericMapDifferentType() {
	mapped := mapSlice[int32, string](
		[]int32{1, 2, 3, 4, 5},
		func(curr int32) string {
			return fmt.Sprintf("$%v", curr)
		},
	)
	fmt.Println("mapped:", mapped)
}

// ---
// Reduce
// ---

func reduce[I any, O any](items []I, reducerFunc func(acc O, curr I) O, initial O) O {
	result := initial
	for _, item := range items {
		result = reducerFunc(result, item)
	}
	return result
}

func basicGenericReduceSameType() {
	reduced := reduce[int32, int32](
		[]int32{1, 2, 3, 4, 5},
		func(acc, curr int32) int32 {
			return acc + curr
		},
		0,
	)
	fmt.Println("reduced:", reduced)
}

func basicGenericReduceDifferentType() {
	reduced := reduce[string, int](
		[]string{"Why", "would", "you", "go", "so", "far", "for", "me?"},
		func(acc int, curr string) int {
			return acc + len(curr)
		},
		0,
	)
	fmt.Println("reduced:", reduced)
}

// ---
// Filter
// ---

func filter[T any](items []T, filterFunc func(curr T) bool) []T {
	result := []T{}
	for _, item := range items {
		if keep := filterFunc(item); keep {
			result = append(result, item)
		}
	}
	return result
}

func basicFilter() {
	filtered := filter[int32](
		[]int32{1, 2, 3, 4, 5},
		func(curr int32) bool {
			return curr > 3
		},
	)
	fmt.Println("filtered:", filtered)
}
