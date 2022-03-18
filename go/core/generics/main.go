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
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

// ---
// sum
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
	sumInts := sumNumbers[int32]([]int32{1, 2, 3, 4, 5})
	sumfloats := sumNumbers[float32]([]float32{1, 2, 3, 4, 5})
	sumInferred := sumNumbers([]float32{1, 2, 3, 4, 5})

	fmt.Println("sumInts: ", sumInts)
	fmt.Println("sumfloats: ", sumfloats)
	fmt.Println("sumInferred: ", sumInferred)
}

// ---
// find
// ---

func find[T any](items []T, predicate func(item T) bool) (T, bool) {
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
