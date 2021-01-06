package main

import (
	// standard packages
	"fmt"
	"runtime"
	"strings"

	// external packages
	funk "github.com/thoas/go-funk"
)

// ---
// main
// ---

func main() {
	// runtime
	getRuntimeDetails()
	// funk
	useFunk()
}

// ---
// helper func
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

// ---------
// notes
// ---------

// ---
// runtime details
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

// ---
// funk
// ---

func useFunk() {
	printSectionTitle("funk")

	// ---
	// slices
	// ---

	// many of these functions have an interface version, and many versions for specific types
	// Contains -- Float32, Float64, Int, String, etc
	// Difference -- Int, String, etc
	// Filter -- Float32, Float64, Int, String, etc
	// Find -- Float32, Float64, Int, String, dtc
	// Max/Min -- Int, Float32, Float64, String, etc
	// Uniq -- Float32, Float64, Int, String, etc

	// Compact (iteratee without empty/0 values)
	compact := funk.Compact([]string{"Kakashi", "Obito", "", "Hiruzen", "", "Itachi", "Hashirama"})
	// Contains (true if matching element found)
	contains := funk.Contains(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		"Kakashi",
	)
	// Difference (remove common elements)
	diffA, diffB := funk.Difference(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		[]string{"Hiruzen", "Iruka", "Yamato"},
	)
	// Equal
	equal := funk.Equal(
		[]string{"Hiruzen", "Iruka", "Yamato"},
		[]string{"Hiruzen", "Iruka", "Yamato"},
	)
	// Every (iteratee contains all elements)
	every := funk.Every(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama", "Iruka"},
		[]string{"Hiruzen", "Iruka"},
	)
	// Filter (iteratee with only elements that pass predicate)
	filtered := funk.Filter(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		func(str string) bool { return strings.HasPrefix(str, "H") },
	)
	// Find (first element that matches predicate)
	found := funk.Find(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		func(str string) bool { return strings.HasPrefix(str, "H") },
	)
	flattenedSlice := funk.FlattenDeep([][]string{
		[]string{"Kakashi", "Yamato"},
		[]string{"Hiruzen", "Iruka"},
	})
	// ForEach
	names := []string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"}
	upperNames := []string{}
	funk.ForEach(
		names,
		func(name string) { upperNames = append(upperNames, strings.ToUpper(name)) },
	)

	// IndexOf
	indexOf := funk.IndexOf(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		"Kakashi",
	)
	// InnerJoin (find common elements)
	common := funk.InnerJoinString(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		[]string{"Hiruzen", "Iruka", "Yamato"},
	)
	// Join
	innerJoined := funk.Join(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		[]string{"Hiruzen", "Iruka", "Yamato"},
		funk.InnerJoin, // and (common to both)
	)
	outerJoined := funk.Join(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		[]string{"Hiruzen", "Iruka", "Yamato"},
		funk.OuterJoin, // xor (in one but not both)
	)
	// Map
	mapped := funk.Map(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		func(name string) string { return strings.ToUpper(name) },
	)
	// MaxInt
	max := funk.MaxInt([]int{1, 2, 3, 4, 5})
	// MinInt
	min := funk.MinInt([]int{1, 2, 3, 4, 5})
	// Reduce
	reduced := funk.Reduce(
		[]int{1, 2, 3, 4, 5},                        // iteratee
		func(cur, acc int) int { return acc + cur }, // reducer
		0, // accumulator
	)
	// Reverse
	reversed := funk.Reverse([]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"})
	// ShortIf
	ternary := funk.ShortIf
	useDark := true
	theme := ternary(useDark, "dark", "light")
	// Shuffle
	shuffled := funk.Shuffle([]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"})
	// Subset
	isSubset := funk.Subset(
		[]string{"Kakashi", "Hiruzen"},
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
	)
	// Subtract
	difference := funk.Subtract(
		[]string{"Kakashi", "Obito", "Hiruzen", "Itachi", "Hashirama"},
		[]string{"Kakashi", "Hiruzen"},
	)
	// Uniq
	unique := funk.Uniq([]string{"Yamato", "Hiruzen", "Ao", "Hiruzen"})
	// Without
	without := funk.Without(
		[]string{"Hiruzen", "", "Iruka", "", "Yamato"},
		"",
	)

	// ---
	// structs
	// ---

	// Get
	// *** later ***

	// Keys
	// *** later ***

	// PtrOf
	// *** later ***

	// Set
	// *** later ***

	// print results
	bulkPrint(
		"compact", compact,
		"contains", contains,
		"difference", diffA, diffB,
		"equal", equal,
		"every", every,
		"filtered", filtered,
		"found", found,
		"flattenedSlice", flattenedSlice,
		"upperNames", upperNames,
		"indexOf", indexOf,
		"common", common,
		"innerJoined", innerJoined,
		"outerJoined", outerJoined,
		"mapped", mapped,
		"max", max,
		"min", min,
		"reduced", reduced,
		"reversed", reversed,
		"theme", theme,
		"shuffled", shuffled,
		"isSubset", isSubset,
		"difference", difference,
		"unique", unique,
		"without", without,
	)
}
