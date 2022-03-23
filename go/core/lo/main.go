package main

import (
	"fmt"
	"strings"

	"github.com/samber/lo"
	lop "github.com/samber/lo/parallel"
)

func main() {
	printSectionTitle("basic lo usage")
	basicLoUsage()

	printSectionTitle("basic lop usage")
	basicLopUsage()
}

func printSectionTitle(title string) {
	fmt.Println("")
	fmt.Println(strings.ToUpper(title))
	fmt.Println("")
}

func basicLoUsage() {
	found, _ := lo.Find(
		[]int{1, 2, 3, 4, 5},
		func(n int) bool {
			return n > 3
		},
	)
	filtered := lo.Filter(
		[]int{1, 2, 3, 4, 5},
		func(n int, _ int) bool {
			return n > 3
		},
	)
	mapped := lop.Map(
		[]int{1, 2, 3, 4, 5},
		func(n int, _ int) int {
			return n * 2
		},
	)
	reduced := lo.Reduce(
		[]int{1, 2, 3, 4, 5},
		func(acc int, curr int, _ int) int {
			return acc + curr
		},
		0,
	)
	last, _ := lo.Last([]int{1, 2, 3, 4, 5})
	chunked := lo.Chunk([]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 5)
	reversed := lo.Reverse([]int{1, 2, 3, 4, 5})
	unique := lo.Uniq([]int{1, 2, 3, 4, 3, 2, 1})

	fmt.Println("found: ", found)
	fmt.Println("filtered: ", filtered)
	fmt.Println("mapped: ", mapped)
	fmt.Println("reduced: ", reduced)
	fmt.Println("last: ", last)
	fmt.Println("chunked: ", chunked)
	fmt.Println("reversed: ", reversed)
	fmt.Println("unique: ", unique)
}

func basicLopUsage() {
	mapped := lop.Map(
		[]int{1, 2, 3, 4, 5},
		func(n int, _ int) int {
			return n * 2
		},
	)

	fmt.Println("mapped: ", mapped)
}
